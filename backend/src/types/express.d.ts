import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        username: string;
      };
    }
  }
}

export interface AuthRequest extends Request {
  body: {
    email?: string;
    password?: string;
    name?: string;
    username?: string;
    refreshToken?: string;
  };
  user?: UserAttributes;
}