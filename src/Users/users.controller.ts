import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { ControllerResponse } from '../types';
import { UserNotFound, UserServiceError, UserCreateError } from './errors';
import userService from './users.service';
import { AuthService } from '../auth/auth.service';

const authService = new AuthService(userService);

export const postUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { username, email, password } = req.body;

  try {
    const user = await userService.createUser(username, email, password);
    const result = await authService.login(email, password, res);
    return res.status(201).json(result);
  } catch (err: any) {
    return next(new UserCreateError(err.message));
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password, res);
    return res.json(result);
  } catch (err: any) {
    return next(new Error('Invalid credentials'));
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  try {
    const userId = (req.user as any)?._id;
    if (!userId) {
      return next(new UserNotFound('User not authenticated'));
    }

    const user = await userService.getUserById(new ObjectId(userId));
    if (!user) {
      return next(new UserNotFound());
    }

    return res.status(200).json(user);
  } catch (err: any) {
    return next(new UserServiceError(err.message));
  }
};

export const logoutUser = async (
  _req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  try {
    const result = await authService.logout(res);
    return res.json(result);
  } catch (err: any) {
    return next(new UserServiceError(err.message));
  }
};
