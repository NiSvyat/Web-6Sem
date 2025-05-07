const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

class User extends Model {}

// структура модели
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // первичный ключ
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true, // включение createdAt и updatedAt
});

// синхронизация модели с базой данных
const syncModel = async () => {
  try {
    await User.sync();
    console.log('таблица "users" успешно синхронизирована.');
  } catch (error) {
    console.error('ошибка при синхронизации таблицы "users":', error);
  }
}

module.exports = { User, syncModel };