import { ObjectId } from 'mongodb';
import User, { RegisterUserInput, LoginUserInput, IUser } from './User.model';

export type UserWithToken = { user: Omit<IUser, 'password'>; token: string };

const registerUser = async ({
  username,
  email,
  password,
}: RegisterUserInput): Promise<UserWithToken | null> => {
  const userByEmail = await User.findOne({ email });
  const userByUsername = await User.findOne({ username });

  // TODO: nice to have - hit endpoint (in frontend) to check if username is taken

  if (userByEmail || userByUsername) return null;

  const user = new User({ username, email, password });
  const token = user.generateAuthToken();
  await user.save();

  return { user, token };
};

const getUserByEmail = async ({
  email,
  password,
}: LoginUserInput): Promise<UserWithToken | null> => {
  const user = await User.findOne({ email }).select('+password');

  if (!user) return null;

  const isMatch = await user.comparePassword(password);

  if (!isMatch) return null;

  const token = user.generateAuthToken();

  return { user, token };
};

const getUserById = async (userId: ObjectId): Promise<IUser | null> => {
  return User.findById(userId);
};

const getManyUsers = async (): Promise<Array<IUser>> => {
  return User.find();
};

export default { getUserById, getUserByEmail, getManyUsers, registerUser };
