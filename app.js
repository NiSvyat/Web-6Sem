const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { authenticate } = require('./config/db');
const Event = require('./models/Event'); // Импортируем модель Event
const User = require('./models/User'); // Импортируем модель Event

const app = express();

// Настройка middleware
app.use(express.json());
app.use(cors());

const PORT = 8081;

// Проверяем соединение с базой данных
authenticate();

// Синхронизация модели с базой данных
const syncDatabase = async () => {
    try {
        await User.sync(); // Синхронизируем модель
        console.log('Модель User успешно синхронизирована с базой данных.');
    } catch (error) {
        console.error('Ошибка при синхронизации модели User:', error);
    }
    try {
        await Event.sync(); // Синхронизируем модель
        console.log('Модель Event успешно синхронизирована с базой данных.');
    } catch (error) {
        console.error('Ошибка при синхронизации модели Event:', error);
    }

};

// Вызов функции синхронизации
syncDatabase();

// Запуск сервера
app.listen(PORT, (err) => {
    if (err) {
        console.error(`Ошибка при запуске сервера: ${err.message}`);
        return;
    }
    console.log(`Сервер запущен на порту ${PORT}`);
});
