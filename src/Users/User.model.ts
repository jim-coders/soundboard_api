import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  favorites: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  __v?: number;
}

export type BaseUserInput = Partial<
  Pick<IUser, 'username' | 'email' | 'password' | 'favorites'>
>;

export type CreateUserInput = Required<
  Pick<BaseUserInput, 'username' | 'email' | 'password'>
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
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  bcrypt.hash(user.password, salt);

  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this.toJSON();

  return bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
