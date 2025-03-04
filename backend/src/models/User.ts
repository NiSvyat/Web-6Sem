import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import EventModel from './EventModel';

interface UserAttributes {
  id: number;
  name: string;
  email?: string;
  password: string;
  createdAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;

  static associate(models: { EventModel: typeof EventModel }): void {
    User.hasMany(models.EventModel, {
      foreignKey: 'createdBy',
      sourceKey: 'id',
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
