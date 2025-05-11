import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface RefreshTokenAttributes {
  id: number;
  token: string;
  expiresAt: Date;
}

export class RefreshToken extends Model<RefreshTokenAttributes, Optional<RefreshTokenAttributes, 'id'>>
  implements RefreshTokenAttributes {
  public id!: number;
  public token!: string;
  public expiresAt!: Date;
}

export default (sequelize: Sequelize): typeof RefreshToken => {
  RefreshToken.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    timestamps: true
  });

  return RefreshToken;
};

export type RefreshTokenInstance = InstanceType<typeof RefreshToken>;