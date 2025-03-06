import { sequelize } from './config/db';
import EventModel from './models/EventModel';
import User from './models/User';
import { startServer } from './app';

// Устанавливаем ассоциацию один-ко-многим
User.hasMany(EventModel, {
  foreignKey: 'createdBy',
  sourceKey: 'id',
});

// Устанавливаем ассоциацию многие-к-одному
EventModel.belongsTo(User, {
  foreignKey: 'createdBy',
  targetKey: 'id',
});

// Проверка подключения к базе данных
const checkDatabaseConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных успешно установлено.');

    // Удаляем таблицы (если нужно)
    await EventModel.drop();
    await User.drop();

    // Синхронизируем модели
    await User.sync();
    await EventModel.sync();
    console.log('Модели успешно синхронизированы с базой данных.');
  } catch (error) {
    console.error('Не удалось подключиться к базе данных:', error);
  }
};

// Вызов функции проверки соединения
checkDatabaseConnection();

// Запускаем сервер
startServer();
