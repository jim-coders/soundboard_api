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

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { id } = req.params;
  const userId = new ObjectId(id);

  try {
    const user = await userService.getUserById(userId);
    return res.status(200).json(user);
  } catch (err: any) {
    return next(new UserNotFound());
  }
};

export const getManyUsers = async (
  _: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  try {
    const user = await userService.getManyUsers();
    return res.status(201).json(user);
  } catch (err: any) {
    return next(new UserServiceError());
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  try {
    // TODO: Properly type the User interface to include _id
    const userId = (req.user as any)?._id;
    if (!userId) {
      return next(new UserNotFound('User not authenticated'));
    }

    const user = await userService.getUserById(
      new ObjectId(userId.toString() as string) // TODO: fix this by typing the userId from the request
    );
    if (!user) {
      return next(new UserNotFound());
    }

    return res.status(200).json(user);
  } catch (err: any) {
    return next(new UserServiceError(err.message));
  }
};

export const logoutUser = async (
  req: Request,
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
