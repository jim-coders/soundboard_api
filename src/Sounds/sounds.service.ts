import { ObjectId } from 'mongodb';
import Sound, { CreateSoundInput, ISound } from './Sound.model';
import { deleteObject } from '../services/s3.service';

const createSound = async (
  sound: CreateSoundInput,
  userId: ObjectId
): Promise<ISound> => {
  const { description, title, metadata } = sound;

  const newSound = new Sound({
    description,
    title,
    metadata: {
      s3Key: metadata.s3Key,
      bucketName: metadata.bucketName,
      fileType: metadata.fileType,
      fileSize: metadata.fileSize,
    },
    user: userId,
  });

  await newSound.save();
  const userSound = await Sound.findById(newSound._id).populate(
    'user',
    '-_id username email'
  );

  if (!userSound) {
    throw new Error('Failed to create sound');
  }

  return userSound;
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

const deleteSound = async (soundId: string): Promise<void> => {
  const sound = await Sound.findById(soundId);

  if (!sound) {
    throw new Error('Sound not found');
  }

  // Delete from S3 first
  try {
    await deleteObject(sound.metadata.s3Key);
  } catch (error) {
    console.error('Failed to delete from S3:', error);
    // Continue with deletion from database even if S3 deletion fails
  }

  // Delete from database
  await Sound.findByIdAndDelete(soundId);
};

export default { createSound, getSoundByUser, getManySounds, deleteSound };
