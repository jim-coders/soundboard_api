import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/globalConfig';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  favorites: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  createdAt: Date;
  __v?: number;
}

export type BaseUserInput = Partial<
  Pick<IUser, 'username' | 'email' | 'password' | 'favorites'>
>;

export type RegisterUserInput = Required<
  Pick<BaseUserInput, 'username' | 'email' | 'password'>
>;

export type LoginUserInput = Required<
  Pick<BaseUserInput, 'email' | 'password'>
>;

const UserSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Sound',
    },
  ],
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 25,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  __v: { type: Number, select: false },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, jwtSecret);
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = await mongoose
    .model<IUser>('User')
    .findById(this._id)
    .select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  return bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
