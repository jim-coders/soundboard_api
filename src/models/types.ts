import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  sounds: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
}
