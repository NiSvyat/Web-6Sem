import { Request, Response, NextFunction } from 'express';

// проверка на origin
const checkTrustedOrigin = (str: string) => (req: Request, res: Response, next: NextFunction) => {
  // получение списка разрешённых методов из .env
  const allowedMethods = process.env.CORS_ALLOWED_METHODS?.split(",") || [];

  // проверка на ограничения
  if (!allowedMethods.includes(str)) {
    const origin = req.get("origin"); // заголовок Origin

    // разрешение запроса если origin отсутствует
    if (!origin) {
      console.warn("заголовок Origin отсутствует. запрос разрешён.");
      return next();
    }

    // получение списка доверенных origin из .env
    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(",") || [];

    // проверка на доверенность
    if (allowedOrigins.includes(origin)) {
      console.log(`запрос от доверенного origin: ${origin}`);
      next();
    } else {
      console.warn(`запрос от недоверенного origin: ${origin}`);
      res.status(403).json({ error: "запрос запрещён" });
    }
  } else {
    next();
  }
};

export { checkTrustedOrigin };