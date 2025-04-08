import { ObjectId } from 'mongodb';
import Sound, { CreateSoundInput, ISound } from './Sound.model';
import { deleteObject, listObjects } from '../services/s3.service';
import { S3Error } from '../types/errors';

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
    if (error instanceof S3Error) {
      console.error('Failed to delete from S3:', error.message);
      // Continue with deletion from database even if S3 deletion fails
    } else {
      throw error;
    }
  }

  // Delete from database
  await Sound.findByIdAndDelete(soundId);
};

const cleanupOrphanedFiles = async (): Promise<{
  deleted: string[];
  errors: string[];
}> => {
  try {
    // Get all sounds from database
    const sounds = await Sound.find();
    const validS3Keys = new Set(sounds.map((sound) => sound.metadata.s3Key));

    // Get all files from S3
    const s3Files = await listObjects();

    // Find orphaned files (files in S3 but not in database)
    const orphanedFiles = s3Files.filter((key) => !validS3Keys.has(key));

    const deleted: string[] = [];
    const errors: string[] = [];

    // Delete orphaned files
    for (const key of orphanedFiles) {
      try {
        await deleteObject(key);
        deleted.push(key);
      } catch (error) {
        if (error instanceof S3Error) {
          console.error(
            `Failed to delete orphaned file ${key}:`,
            error.message
          );
          errors.push(key);
        } else {
          throw error;
        }
      }
    }

    return { deleted, errors };
  } catch (error) {
    console.error('Error cleaning up orphaned files:', error);
    throw new Error('Failed to clean up orphaned files');
  }
};

export default {
  createSound,
  getSoundByUser,
  getManySounds,
  deleteSound,
  cleanupOrphanedFiles,
};
