import { Model, DataTypes, Optional } from 'sequelize';

interface EventAttributes {
  id: number;
  title: string;
  description: string | null;
  date: Date;
  category: 'Музыкальное мероприятие' | 'Спортивное мероприятие' | 'Искусство' |
    'Бизнес встреча' | 'Семинар' | 'Образовательная встреча' |
    'Деловая встреча' | 'Другое';
  createdBy: number;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

export default (sequelize: any) => {
  class Event extends Model<EventAttributes, EventCreationAttributes> implements EventAttributes {
    public id!: number;
    public title!: string;
    public description!: string | null;
    public date!: Date;
    public category!: EventAttributes['category'];
    public createdBy!: number;
  }

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