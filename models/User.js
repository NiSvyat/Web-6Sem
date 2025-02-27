const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Импортируем sequelize
const bcrypt = require('bcrypt'); // Импортируем bcrypt для хеширования паролей

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
        type: DataTypes.STRING, // Изменяем тип на STRING для email
        allowNull: false, // Поле обязательно
        unique: true, // Уникальный email
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Поле обязательно
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
    hooks: {
        // Хук для хеширования пароля перед созданием пользователя
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10); // Генерируем соль
                user.password = await bcrypt.hash(user.password, salt); // Хешируем пароль
            }
        },
        // Хук для хеширования пароля перед обновлением пользователя
        beforeUpdate: async (user) => {
            if (user.changed('password')) { // Проверяем, изменился ли пароль
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

// Метод для проверки пароля
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Экспортируем модель
module.exports = User;