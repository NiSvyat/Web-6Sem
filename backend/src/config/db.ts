import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

// Загрузка конфигурации из .env
dotenv.config();

// Интерфейс для переменных окружения
interface DatabaseConfig {
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_DIALECT: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
}

// Загрузка переменных из .env с проверкой
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
} = process.env as unknown as DatabaseConfig;

// Проверка обязательных переменных окружения
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_DIALECT) {
  throw new Error('Не все обязательные переменные окружения для базы данных заданы');
}

// Объект sequelize с параметрами подключения
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
});

// Функция для проверки соединения
const authenticateDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных успешно установлено.');
  } catch (error) {
    console.error('Не удалось подключиться к базе данных:', error);
    // Можно пробросить ошибку дальше, если нужно
    throw error;
  }
};

// Экспорт
export {
  sequelize,
  authenticateDB,
};