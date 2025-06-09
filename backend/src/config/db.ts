import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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

console.log('Проверка загрузки .env:', {
  DB_NAME,
  DB_HOST,
});

// Проверка обязательных переменных окружения
if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_DIALECT) {
  console.error('Отсутствуют следующие переменные окружения:');
  console.table({
    DB_NAME: DB_NAME || 'не задано',
    DB_USER: DB_USER || 'не задано',
    DB_PASSWORD: DB_PASSWORD ? '******' : 'не задано', // Маскируем пароль для безопасности
    DB_HOST: DB_HOST || 'не задано',
    DB_DIALECT: DB_DIALECT || 'не задано'
  });
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