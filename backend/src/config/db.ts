import { Sequelize } from 'sequelize';
import { config } from 'dotenv'; // Именованный импорт

// Загружаем переменные окружения из .env файла
config();

// Создаем объект Sequelize с параметрами подключения
const sequelize = new Sequelize(
  process.env.DB_NAME!, // Используем "!", так как переменные окружения гарантированно существуют
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST!,
    dialect: 'postgres',
  }
);

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);

// Функция для проверки соединения
const authenticate = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных успешно установлено.');
  } catch (error) {
    console.error('Не удалось подключиться к базе данных:', error);
  }
};

// Экспортируем объект sequelize и функцию authenticate
export { sequelize, authenticate };
