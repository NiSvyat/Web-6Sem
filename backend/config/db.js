const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// загрузка конфигурации из .env
dotenv.config();

// загрузка переменных из .env
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT;

// объект sequelize с параметрами подключения
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

// функция для проверки соединения
const authenticateDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('соединение с базой данных успешно установлено.');
  } catch (error) {
    console.error('не удалось подключиться к базе данных:', error);
  }
};

module.exports = {
  sequelize,
  authenticateDB,
};