const express = require('express');
const router = express.Router();
const { User } = require('../models/User'); // Импортируем модель User
const bcrypt = require('bcrypt'); // Для хеширования пароля
const { generateToken } = require('../config/passport'); // Для генерации токена (если нужно)

// Эндпоинт для регистрации
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Ошибка валидации данных или пользователь уже существует
 *       500:
 *         description: Ошибка сервера
 */
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Проверка обязательных полей
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
  }

  try {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создаем нового пользователя
    const newUser = await User.create({ name, email, password });

    // Возвращаем успешный ответ
    res
      .status(201)
      .json({ message: 'Пользователь успешно зарегистрирован', user: newUser });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Эндпоинт для авторизации
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Вход в систему
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT-токен для доступа к защищенным маршрутам
 *       400:
 *         description: Неверные учетные данные
 *       500:
 *         description: Ошибка сервера
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Проверка обязательных полей
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Пожалуйста, укажите email и пароль' });
  }

  try {
    // Ищем пользователя по email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Пользователь с таким email не найден' });
    }

    // Проверяем пароль
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    // Генерируем JWT-токен
    const token = generateToken(user);

    // Возвращаем токен клиенту
    res.status(200).json({ token });
  } catch (error) {
    console.error('Ошибка при входе в систему:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Экспортируем роутер
module.exports = router;
