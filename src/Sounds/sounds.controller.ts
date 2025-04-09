import { ObjectId } from 'mongodb';
import { NextFunction, Request, Response } from 'express';
import { ControllerResponse } from '../types';
import soundService from './sounds.service';
import {
  SoundCreateError,
  SoundServiceError,
  MissingFileTypeError,
  MissingFileNameError,
} from './errors';
import { generateUploadUrl, generateReadUrl } from '../services/s3.service';
import { CreateSoundInput } from './Sound.model';
import Sound from './Sound.model';

export const postSounds = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { description, title, metadata } = req.body;
  const userId = (req.user as any)?._id;

  if (!userId) {
    return next(new SoundCreateError('User not authenticated'));
  }

  // Validate required fields
  if (!description || !title) {
    return next(
      new SoundCreateError(
        'Missing required fields: description and title are required'
      )
    );
  }

  // Validate metadata
  if (
    !metadata ||
    !metadata.s3Key ||
    !metadata.bucketName ||
    !metadata.fileType ||
    !metadata.fileSize
  ) {
    return next(new SoundCreateError('Missing required metadata fields'));
  }

  try {
    const soundInput: CreateSoundInput = {
      description,
      title,
      metadata: {
        s3Key: metadata.s3Key,
        bucketName: metadata.bucketName,
        fileType: metadata.fileType,
        fileSize: metadata.fileSize,
      },
    };

    const userSound = await soundService.createSound(
      soundInput,
      new ObjectId(userId as string)
    );
    return res.status(201).json(userSound);
  } catch (err: any) {
    return next(new SoundCreateError(err.message));
  }
};

export const getSoundByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { id } = req.params;
  const userId = new ObjectId(id);

  try {
    const sound = await soundService.getSoundByUser(userId);
    res.status(201).json(sound);
  } catch (err: any) {
    return next(new SoundServiceError());
  }
};

export const getManySounds = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const userId = (req.user as any)?._id;

  if (!userId) {
    return next(new SoundServiceError('User not authenticated'));
  }

  try {
    const sounds = await soundService.getManySounds(
      new ObjectId(userId as string)
    );
    res.status(200).json(sounds);
  } catch (err: any) {
    return next(new SoundServiceError());
  }
};

export const getUploadUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { fileType, fileName } = req.query;

  if (!fileType || typeof fileType !== 'string') {
    return next(new MissingFileTypeError());
  }

  if (!fileName || typeof fileName !== 'string') {
    return next(new MissingFileNameError());
  }

  try {
    const { url, key } = await generateUploadUrl(fileType, fileName);
    return res.json({
      url,
      key,
      bucketName: process.env.AWS_BUCKET_NAME,
    });
  } catch (error: any) {
    return next(new SoundServiceError(error.message));
  }
};

export const deleteSound = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { id } = req.params;
  const userId = (req.user as any)?._id;

  if (!userId) {
    return next(new SoundServiceError('User not authenticated'));
  }

  try {
    await soundService.deleteSound(id, new ObjectId(userId as string));
    return res.status(204).send();
  } catch (err: any) {
    return next(new SoundServiceError('Failed to delete sound'));
  }
};

export const getSoundUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
): ControllerResponse => {
  const { id } = req.params;
  const userId = (req.user as any)?._id;

  if (!userId) {
    return next(new SoundServiceError('User not authenticated'));
  }

  try {
    const sound = await Sound.findOne({ _id: id, user: new ObjectId(userId) });
    if (!sound) {
      return next(new SoundServiceError('Sound not found'));
    }

    // Generate a presigned URL for the sound file
    const url = await generateReadUrl(sound.metadata.s3Key);
    return res.json({ url });
  } catch (err: any) {
    return next(new SoundServiceError('Failed to get sound URL'));
  }
};
