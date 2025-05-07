const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

class Event extends Model {}

// структура модели
Event.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true, // первичный ключ
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM(
      'music',
      'sports',
      'arts',
      'business',
      'technology',
      'education',
      'food',
      'other'
    ),
    allowNull: false,
    defaultValue: 'other'
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }, // определение внешнего ключа
  },
}, {
  sequelize,
  modelName: 'Event',
  tableName: 'events',
  timestamps: true, // включение createdAt и updatedAt
});

// синхронизация модели с базой данных
const syncModel = async () => {
  try {
    await Event.sync({ alter: true }); // Using alter: true to modify existing table
    console.log('таблица "events" успешно синхронизирована.');
  } catch (error) {
    console.error('ошибка при синхронизации таблицы "events":', error);
  }
}

module.exports = { Event, syncModel };