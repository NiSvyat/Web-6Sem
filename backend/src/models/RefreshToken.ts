// src/models/RefreshToken.ts
import { Model, DataTypes, Sequelize } from 'sequelize';
import { User } from './User.js'; // Импортируем модель User

interface RefreshTokenAttributes {
  id?: number;
  token: string;
  expiresAt: Date;
  userId: number;
}

export class RefreshToken extends Model<RefreshTokenAttributes> implements RefreshTokenAttributes {
  declare id: number;
  declare token: string;
  declare expiresAt: Date;
  declare userId: number;

  // Добавляем декларацию для связи
  declare User?: User;
}

export default (sequelize: Sequelize): typeof RefreshToken => {
  RefreshToken.init({
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true
  });

  return RefreshToken;
};