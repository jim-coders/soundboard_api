import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ISound extends Document {
  description: string;
  duration?: string;
  metadata: {
    s3Key: string;
    bucketName: string;
    fileType: string;
    fileSize: number; // in bytes
  };
  title: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  __v?: number;
  getUrl(): string; // Method to get the S3 URL
}

export type BaseSoundInput = Partial<
  Pick<ISound, 'description' | 'title' | 'metadata'>
>;

export type CreateSoundInput = Required<
  Pick<ISound, 'description' | 'title' | 'metadata'>
>;

const SoundSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  metadata: {
    s3Key: {
      type: String,
      required: true,
    },
    bucketName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
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

// Method to generate the S3 URL for the sound
SoundSchema.methods.getUrl = function (): string {
  return `https://${this.metadata.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${this.metadata.s3Key}`;
};

const Sound = mongoose.model<ISound>('Sound', SoundSchema);

export default Sound;
