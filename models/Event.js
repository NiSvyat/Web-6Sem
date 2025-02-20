const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Импортируем sequelize
const User = require('./User'); // Импортируем модель User

class Event extends Model {}

// Определяем структуру модели
Event.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false, // Поле обязательно
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true, // Поле не обязательно
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false, // Поле обязательно
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false, // Поле обязательно
    },
}, {
    sequelize, // Передаем экземпляр sequelize
    modelName: 'Event', // Имя модели
    tableName: 'events', // Имя таблицы в базе данных
    timestamps: true, // Включаем поля createdAt и updatedAt
});


// Экспортируем модель
module.exports = Event;
