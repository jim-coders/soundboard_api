import { Request, Response } from 'express';
import User from '../models/User';
import hashPassword from '../utils/hashPassword';

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
