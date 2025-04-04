import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../error';

const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err.statusCode) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: err.message });
};

export default errorHandler;
