import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/globalConfig';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  createdAt: Date;
  __v?: number;
}

export type BaseUserInput = Partial<
  Pick<IUser, 'username' | 'email' | 'password'>
>;

export type RegisterUserInput = Required<
  Pick<BaseUserInput, 'username' | 'email' | 'password'>
>;

export type LoginUserInput = Required<
  Pick<BaseUserInput, 'email' | 'password'>
>;

const UserSchema: Schema<IUser> = new Schema(
  {
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
  },
  {
    toJSON: {
      transform: (_doc, ret: Partial<IUser>) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

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
}; // TODO: add token expiration, refresh token, and move this logic to a service

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
