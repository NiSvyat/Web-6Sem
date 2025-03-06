import { Request, Response, NextFunction } from 'express';

const apiKeyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const apiKey = req.headers['api_key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(403).json({ message: 'Доступ запрещен: неверный API-ключ' });
    return; // Завершаем выполнение функции
  }
  next(); // Передаем управление следующему middleware
};

export default apiKeyMiddleware;
