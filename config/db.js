const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Загружаем переменные окружения из .env файла
dotenv.config();

// Создаем объект Sequelize с параметрами подключения
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);


// Функция для проверки соединения
const authenticate = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с базой данных успешно установлено.');
    } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error);
    }
};

// Экспортируем объект sequelize и функцию authenticate
module.exports = {
    sequelize,
    authenticate,
};
