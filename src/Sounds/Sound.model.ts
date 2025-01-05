import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ISound extends Document {
  description: string;
  duration: string;
  metadata: {
    s3Key: string;
    bucketName: string;
    fileType: string;
  };
  title: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  __v?: number;
}

export type BaseSoundInput = Partial<
  Pick<ISound, 'description' | 'title' | 'metadata'>
>;

export type CreateSoundInput = Required<
  Pick<BaseSoundInput, 'description' | 'title' | 'metadata'>
>;

const SoundSchema = new Schema({
  description: {
    type: String,
  },
  duration: {
    type: String, // Duration in seconds
  },
  metadata: {
    s3Key: String, // The unique key for the sound in the S3 bucket
    bucketName: String, // The name of the S3 bucket
    fileType: String, // MIME type of the file (e.g., 'audio/mpeg', 'audio/wav')
  },
  title: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  __v: { type: Number, select: false },
});

const Sound = mongoose.model<ISound>('Sound', SoundSchema);

export default Sound;
