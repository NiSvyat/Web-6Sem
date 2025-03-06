import * as passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import User from '../models/User'; // Используйте default-импорт
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Интерфейс для payload JWT
interface JwtPayload {
  id: number;
  email?: string;
}

// Опции для JWT-стратегии
const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка Authorization
  secretOrKey: process.env.JWT_SECRET as string, // Секретный ключ для подписи токена
};

// Настройка стратегии JWT
passport.use(
  new JwtStrategy(jwtOptions, async (payload: JwtPayload, done) => {
    try {
      // Ищем пользователя по идентификатору из токена
      const user = await User.findByPk(payload.id);

      if (user) {
        // Если пользователь найден, передаем его в запрос
        return done(null, user);
      } else {
        // Если пользователь не найден, возвращаем ошибку
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// Функция для создания JWT-токена
const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    id: user.id, // Идентификатор пользователя
    email: user.email, // Email пользователя (опционально)
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  }); // Токен действителен 1 час
};

// Экспортируем Passport и функцию для генерации токена
export default {
  passport,
  generateToken,
};
