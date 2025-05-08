import { Model, DataTypes, Optional } from 'sequelize';

interface RefreshTokenAttributes {
  id: number;
  token: string;
  expiresAt: Date;
}

interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id'> {}

export default (sequelize: any) => {
  class RefreshToken extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
    implements RefreshTokenAttributes {
    public id!: number;
    public token!: string;
    public expiresAt!: Date;
  }

  RefreshToken.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
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