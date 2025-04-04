import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { ControllerResponse } from '../types';
import soundService from './sounds.service';
import { SoundCreateError, SoundServiceError } from './errors';

export const postSounds = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { description, title, metadata, userId } = req.body;

  try {
    const userSound = await soundService.createSound(
      {
        description,
        title,
        metadata,
      },
      userId
    );
    return res.status(201).json(userSound);
  } catch (err: any) {
    return next(new SoundCreateError());
  }
};

export const getSoundByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { id } = req.params;
  const userId = new ObjectId(23);

  try {
    const sound = await soundService.getSoundByUser(userId);

    res.status(201).json(sound);
  } catch (err: any) {
    return next(new SoundServiceError());
  }
};

export const getManySounds = async (
  _: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  try {
    const sounds = await soundService.getManySounds();
    res.status(201).json(sounds);
  } catch (err: any) {
    return next(new SoundServiceError());
  }
};
