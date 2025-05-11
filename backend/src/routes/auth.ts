import express, { Request, Response, NextFunction } from 'express';
import {
  register,
  login,
  refreshToken,
  logout
} from '../controllers/authController';

// Create router
const router = express.Router();

// Define routes with proper typing
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  register(req, res, next).catch(next);
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  login(req, res, next).catch(next);
});

router.post('/refresh', (req: Request, res: Response, next: NextFunction) => {
  refreshToken(req, res, next).catch(next);
});

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
  logout(req, res, next).catch(next);
});

export default router;