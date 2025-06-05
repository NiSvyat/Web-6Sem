import { AuthRequest } from '../types/express.js';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

// Extract models with proper typing
const User = db.User as typeof db.User & {
  comparePassword: (password: string) => Promise<boolean>;
};
const RefreshToken = db.RefreshToken;

// Environment variables with type checking
const {
  JWT_SECRET = 'default_secret',
  JWT_EXPIRES_IN = '1h',
  REFRESH_TOKEN_EXPIRES_IN = '7d'
} = process.env;

// Type definitions
interface UserAttributes {
  id: number;
  email: string;
  password: string;
  name: string;
}

// interface AuthRequest extends Request {
//   body: {
//     email?: string;
//     password?: string;
//     name?: string;
//     refreshToken?: string;
//   };
//   user?: UserAttributes;
// }

// Convert time string to seconds (e.g., "1h" -> 3600)
const timeStringToSeconds = (timeString: string): number => {
  const unit = timeString.slice(-1);
  const value = parseInt(timeString.slice(0, -1));

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: return parseInt(timeString) || 3600; // default to 1 hour
  }
};

// Properly typed token generation function
const generateTokens = async (user: UserAttributes): Promise<{
  accessToken: string;
  refreshToken: string
}> => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: timeStringToSeconds(JWT_EXPIRES_IN) }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: timeStringToSeconds(REFRESH_TOKEN_EXPIRES_IN) }
  );

  await RefreshToken.create({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    id: user.id
  });

  return { accessToken, refreshToken };
};

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password and username are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Change from 'name' to 'username' since that's what you're receiving
    const user = await User.create({ email, password, name: username }); // Fix here
    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(201).json({
      user: { id: user.id, email: user.email, username: user.name },
      tokens: { accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
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

    res.json({
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

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens((tokenData as any).User);

    await tokenData.destroy();

    res.json({
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

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};