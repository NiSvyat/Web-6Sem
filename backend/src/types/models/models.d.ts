import { Model } from 'sequelize';

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
}
interface EventAttributes {
  id: number;
  title: string;
  description: number;
  date: Date;
  category: string;
  createdBy: number;
}

interface RefreshTokenAttributes {
  token: string;
  expiresAt: Date;
  id: number;
}
declare module '../models' {
  interface UserInstance extends Model<UserAttributes>, UserAttributes {}
  interface EventInstance extends Model<EventAttributes>, EventAttributes {}
  interface RefreshTokenInstance extends Model<RefreshTokenAttributes>, RefreshTokenAttributes {}

  const models: {
    User: UserInstance;
    Event: EventInstance;
    RefreshToken: RefreshTokenInstance;
  };

  export = models;
}