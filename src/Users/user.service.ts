import { ObjectId } from 'mongodb';
import User, { CreateUserInput, IUser } from './User.model';

const createUser = async (user: CreateUserInput): Promise<IUser> => {
  const { username, email, password } = user;
  const newUser = new User({ username, email, password });

  await newUser.save();

  return newUser;
};

const getUserById = async (userId: ObjectId): Promise<IUser | null> => {
  return User.findById(userId);
};

const getManyUsers = async (): Promise<Array<IUser>> => {
  return User.find();
};

export default { createUser, getUserById, getManyUsers };
