import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User'; // Используем импорт по умолчанию

interface EventAttributes {
  id: number;
  title: string;
  description?: string;
  date: Date;
  createdBy: number;
  category: 'концерт' | 'лекция' | 'выставка';
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

class EventModel
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: number;
  public title!: string;
  public description!: string;
  public date!: Date;
  public createdBy!: number;
  public category!: 'концерт' | 'лекция' | 'выставка';

  static associate(models: { User: typeof User }): void {
    EventModel.belongsTo(models.User, {
      foreignKey: 'createdBy',
      targetKey: 'id',
    });
  }
}

EventModel.init(
  {
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
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('концерт', 'лекция', 'выставка'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'EventModel',
    tableName: 'events',
    timestamps: true,
  }
);

export default EventModel;
