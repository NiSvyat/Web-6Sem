import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import * as bcrypt from 'bcryptjs';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Remove the empty interface and use Optional directly
export class User extends Model<UserAttributes, Optional<UserAttributes, 'id'>>
  implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}

export default (sequelize: Sequelize): typeof User => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hash);
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeValidate: (user) => {
        if (user.email) user.email = user.email.toLowerCase().trim();
        if (user.name) user.name = user.name.trim();
      }
    }
  });

  return User;
};

export type UserInstance = InstanceType<typeof User> & {
  comparePassword: (password: string) => Promise<boolean>;
};