const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Импортируем sequelize
const Event = require('./Event'); // Импортируем модель Event

class User extends Model {}

// Определяем структуру модели
User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Поле обязательно
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: true, // Поле не обязательно
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false, // Поле обязательно
    },
}, {
    sequelize, // Передаем экземпляр sequelize
    modelName: 'User', // Имя модели
    tableName: 'users', // Имя таблицы в базе данных
    timestamps: true, // Включаем поля createdAt и updatedAt
});



// Экспортируем модель
module.exports = User;
