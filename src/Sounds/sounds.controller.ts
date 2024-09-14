import { Request, Response } from 'express';
import soundService from './sounds.service';
import { ObjectId } from 'mongodb';

export const postSounds = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { description, title, url, metadata, userId } = req.body;

  try {
    const userSound = await soundService.createSound(
      {
        description,
        title,
        url,
        metadata,
      },
      userId
    );
    res.status(201).json(userSound);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getSoundByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = new ObjectId(id);

  try {
    const sound = await soundService.getSoundByUser(userId);
    res.status(201).json(sound);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getManySounds = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const sounds = await soundService.getManySounds();
    res.status(201).json(sounds);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
