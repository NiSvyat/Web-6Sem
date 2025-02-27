const { sequelize } = require('./config/db'); // Импортируем sequelize из db.js
const Event = require('./models/Event'); // Импортируем модель Event
const User = require('./models/User'); // Импортируем модель Event
const { startServer } = require('./app'); // Импортируем функцию запуска сервера

// Устанавливаем ассоциацию один-ко-многим
User.hasMany(Event, {
    foreignKey: 'createdBy', // Указываем внешний ключ в модели Event
    sourceKey: 'id', // Указываем ключ в модели User
});
// Устанавливаем ассоциацию многие-к-одному
Event.belongsTo(User, {
    foreignKey: 'createdBy', // Указываем внешний ключ в модели Event
    targetKey: 'id', // Указываем ключ в модели User
});

// Проверка подключения к базе данных

const checkDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Соединение с базой данных успешно установлено.');

        // Удаляем таблицы (если нужно)
        await Event.drop(); // Удаляем таблицу Event
        await User.drop(); // Удаляем таблицу User (если нужно)

        // Синхронизируем модели
        await User.sync();
        await Event.sync();
        console.log('Модели успешно синхронизированы с базой данных.');
    } catch (error) {
        console.error('Не удалось подключиться к базе данных:', error);
    }
};


// Вызов функции проверки соединения
checkDatabaseConnection();

// Запускаем сервер
startServer();
