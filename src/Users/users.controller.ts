import { Request, Response } from 'express';
import userService from './users.service';
import { ObjectId } from 'mongodb';

export const postUsers = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const newUser = await userService.createUser({ username, email, password });
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = new ObjectId(id);

  try {
    const user = await userService.getUserById(userId);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getManyUsers = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userService.getManyUsers();
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
