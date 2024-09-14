import { ObjectId } from 'mongodb';
import Sound, { CreateSoundInput, ISound } from './Sound.model';

const createSound = async (
  sound: CreateSoundInput,
  userId: ObjectId
): Promise<ISound> => {
  const { description, title, url, metadata } = sound;

  console.log({ sound }, { userId });

  const newSound = new Sound({
    description,
    title,
    url,
    metadata,
    user: userId,
  });

  await newSound.save();

  return newSound;
};

const getSoundByUser = async (
  userId: ObjectId
): Promise<Array<ISound> | null> => {
  return Sound.find({
    user: userId,
  });
};

const getManySounds = async (): Promise<Array<ISound>> => {
  return Sound.find().populate('user', '-_id username email');
};

export default { createSound, getSoundByUser, getManySounds };
