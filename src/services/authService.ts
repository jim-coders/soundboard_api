import comparePassword from '../utils/comparePassword';

export const authenticateUser = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return comparePassword(password, hashedPassword);
};
