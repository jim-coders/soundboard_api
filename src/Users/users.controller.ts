import { Request, Response } from 'express';
import userService from './users.service';
import { ObjectId } from 'mongodb';

export const registerUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const newUser = await userService.registerUser({
      username,
      email,
      password,
    });
    console.log('new user in controller', newUser);

    if (!newUser) {
      res.status(400).json({ message: 'User already exists' });
    }

    res.status(201).json(newUser);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail({ email, password });

    if (!user) {
      res.status(400).json({ message: 'Invalid user credentials' });
    }

    res.json({ user });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
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
