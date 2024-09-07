import { Request, Response } from 'express';

const errorHandler = (err: Error, _: Request, res: Response): void => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
};

export default errorHandler;
