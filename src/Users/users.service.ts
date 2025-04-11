import { ObjectId } from 'mongodb';
import User, { IUser } from './User.model';
import bcrypt from 'bcryptjs';
import { UserCreateError } from './errors';

// TODO: nice to have - hit endpoint (in frontend) to check if username is taken

const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<IUser> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new UserCreateError('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password, // The pre-save hook will hash the password
  });
  return user;
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email }).select('+password');
};

const getUserById = async (userId: ObjectId): Promise<IUser | null> => {
  return User.findById(userId);
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
};
