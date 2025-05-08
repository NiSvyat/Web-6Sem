import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

// Strict authentication middleware
export const authenticate = passport.authenticate('jwt', { session: false });

// Optional authentication middleware
export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: any) => {
    if (user) {
      (req as any).user = user;  // Type assertion for req.user
    }
    next();
  })(req, res, next);
};