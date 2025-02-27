const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { User } = require('../models/User'); // Импортируем модель User
const jwt = require('jsonwebtoken'); // Для работы с JWT
const dotenv = require('dotenv');

// Загружаем переменные окружения
dotenv.config();

// Опции для JWT-стратегии
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка Authorization
    secretOrKey: process.env.JWT_SECRET, // Секретный ключ для подписи токена
};

// Настройка стратегии JWT
passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
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
const generateToken = (user) => {
    const payload = {
        id: user.id, // Идентификатор пользователя
        email: user.email, // Email пользователя (опционально)
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Токен действителен 1 час
};

// Экспортируем Passport и функцию для генерации токена
module.exports = {
    passport,
    generateToken,
};