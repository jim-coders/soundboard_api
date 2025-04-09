import { ObjectId } from 'mongodb';
import User, { IUser } from './User.model';
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
    password, // Let the pre-save hook handle the hashing
  });

  return user;
};

const loginUser = async (email: string, password: string): Promise<IUser> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

const getUserById = async (userId: ObjectId): Promise<IUser | null> => {
  return User.findById(userId);
};

const getManyUsers = async (): Promise<Array<IUser>> => {
  return User.find();
};

export default {
  createUser,
  loginUser,
  getUserById,
  getManyUsers,
};
