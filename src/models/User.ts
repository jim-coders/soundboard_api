import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './types';

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 25,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  sounds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sound',
    },
  ],
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sound',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
