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
  if (err instanceof SyntaxError && "status" in err && "body" in err) {
    const syntaxError = err as BodyParserSyntaxError;
    if (syntaxError.status === 400) {
      return res.status(400).json({ message: "некорректный JSON." });
    }
  }
  next();
};

export { errorHandler };