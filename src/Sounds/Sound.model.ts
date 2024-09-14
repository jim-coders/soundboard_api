import mongoose from 'mongoose';
const { Schema } = mongoose;

export interface ISound extends Document {
  description: string;
  duration: string;
  metadata: Record<string, unknown>;
  title: string;
  url: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
  __v?: number;
}

export type BaseSoundInput = Partial<
  Pick<ISound, 'description' | 'title' | 'url' | 'metadata'>
>;

export type CreateSoundInput = Required<
  Pick<BaseSoundInput, 'description' | 'title' | 'url' | 'metadata'>
>;

const SoundSchema = new Schema({
  description: {
    type: String,
  },
  duration: {
    type: String, // Duration in seconds
  },
  title: {
    type: String,
    required: true,
  },
  url: {
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
