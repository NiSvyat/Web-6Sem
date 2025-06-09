import { Request, Response, NextFunction } from "express";

interface BodyParserSyntaxError extends SyntaxError {
  status?: number;
  body?: unknown;
}

// проверка на корректность json
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('Error handler:', err);

  if (err instanceof SyntaxError && "status" in err && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "некорректный JSON." });
  }

  next(err);
};

export { errorHandler };