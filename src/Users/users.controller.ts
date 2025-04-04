import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { ControllerResponse } from '../types';
import {
  InvalidCredentials,
  UserAlreadyRegistered,
  UserNotFound,
  UserServiceError,
} from './errors';
import userService from './users.service';

export const registerUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { username, email, password } = req.body;

  try {
    const newUser = await userService.registerUser({
      username,
      email,
      password,
    });

    if (!newUser) {
      throw new UserAlreadyRegistered();
    }

    return res.status(201).json(newUser);
  } catch (err: any) {
    return next(err);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { email, password } = req.body;

  try {
    const user = await userService.getUserByEmail({ email, password });

    if (!user) {
      throw new InvalidCredentials();
    }

    return res.status(200).json({ user });
  } catch (err: any) {
    return next(err);
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

// export const getCurrentUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): ControllerResponse => {
//   try {
//     const userId = req.user?._id;
//     if (!userId) {
//       return next(new UserNotFound('User not authenticated'));
//     }

//     const user = await userService.getUserById(new ObjectId(userId.toString()));
//     if (!user) {
//       return next(new UserNotFound());
//     }

//     return res.status(200).json(user);
//   } catch (err: any) {
//     return next(new UserServiceError(err.message));
//   }
// };
