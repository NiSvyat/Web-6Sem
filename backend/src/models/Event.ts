const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Event extends Model {}

  Event.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
        'Музыкальное мероприятие',
        'Спортивное мероприятие',
        'Искусство',
        'Бизнес встреча',
        'Семинар',
        'Образовательная встреча',
        'Деловая встреча',
        'Другое'
      ),
      allowNull: false,
      defaultValue: 'Другое'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    timestamps: true,
  });

  return Event;
};