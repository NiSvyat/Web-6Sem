import { Request, Response, NextFunction } from 'express';
import { ValidationError, ValidationErrorItem, Transaction } from 'sequelize';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import db from '../models/index.js';

// Extract models with proper typing
const User = db.User as typeof db.User & {
  comparePassword: (password: string) => Promise<boolean>;
};
const RefreshToken = db.RefreshToken;

// Environment variables with proper type casting
interface JwtConfig {
  secret: Secret;
  expiresIn: number | string;
  refreshExpiresIn: number | string;
}

const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET || 'default_secret',
  expiresIn: process.env.JWT_EXPIRES_IN ?
    (isNaN(Number(process.env.JWT_EXPIRES_IN)) ?
      process.env.JWT_EXPIRES_IN :
      Number(process.env.JWT_EXPIRES_IN)) :
    '1h',
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?
    (isNaN(Number(process.env.REFRESH_TOKEN_EXPIRES_IN)) ?
      process.env.REFRESH_TOKEN_EXPIRES_IN :
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN)) :
    '7d'
};

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Type definitions
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  name: string;
}

interface AuthRequest extends Request {
  body: {
    email?: string;
    password?: string;
    name?: string;
    refreshToken?: string;
  };
  user?: UserAttributes;
}

const generateTokens = async (
  user: UserAttributes,
  transaction?: Transaction
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  if (!jwtConfig.secret) {
    return Promise.reject(new Error('JWT_SECRET is not defined'));
  }
  if (!user.id) {
    return Promise.reject(new Error('User ID is missing'));
  }

  const secret: jwt.Secret = JWT_SECRET as jwt.Secret;
  const expiresInOptions: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
  };
  const refreshExpiresInOptions: jwt.SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']
  };
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    secret,
    expiresInOptions
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    secret,
    refreshExpiresInOptions
  );

  try {
    await RefreshToken.create({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      userId: user.id
    }, { transaction });
  } catch (error) {
    return Promise.reject(error);
  }

  return { accessToken, refreshToken };
};

export const register = async (req: AuthRequest, res: Response) => {
  // 1. Начинаем транзакцию ПЕРЕД всеми операциями с БД
  const transaction = await db.sequelize.transaction();

  try {
    const { email, password, name } = req.body;

    // 2. Валидация (можно вне транзакции, но откатываем при ошибке)
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      await transaction.rollback();
      return res.status(400).json({ error: 'All fields are required' });
    }

    // 3. Проверка существующего пользователя (ВНУТРИ транзакции)
    const existingUser = await User.findOne({
      where: { email },
      transaction // Передаем транзакцию в запрос
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Email already in use' });
    }

    // 4. Создание пользователя (ВНУТРИ транзакции)
    const user = await User.create({
      email: email.trim(),
      password,
      name: name.trim()
    }, {
      transaction, // Критически важно!
      returning: true
    });

    // 5. Генерация токенов (ВНУТРИ транзакции)
    const tokens = await generateTokens(user, transaction);

    // 6. Фиксация всех изменений
    await transaction.commit();

    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });

  } catch (err) {
    // 7. Откат при ЛЮБОЙ ошибке
    if (transaction) await transaction.rollback();

    console.error('Registration error:', err);
    return res.status(500).json({
      error: 'Registration failed',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    return res.json({
      user: { id: user.id, email: user.email, name: user.name },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokenData = await RefreshToken.findOne({
      where: { token },
      include: [User]
    });

    if (!tokenData || new Date(tokenData.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = tokenData.User as UserAttributes;
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

    await tokenData.destroy();

    return res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshToken.destroy({ where: { token: refreshToken } });
    }

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};