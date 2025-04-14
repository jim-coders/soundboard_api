import UsersService from '../users.service';
import { UserCreateError } from '../errors';
import User from '../User.model';
import { ObjectId } from 'mongodb';

// Mock User model
jest.mock('../User.model', () => {
  return {
    findOne: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockReturnValue(null),
    })),
    create: jest.fn(),
    findById: jest.fn().mockImplementation(() => ({
      select: jest.fn().mockReturnValue(null),
    })),
  };
});

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user when email is not taken', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      const mockUser = {
        _id: '123',
        ...userData,
        password: expect.any(String),
      };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UsersService.createUser(
        userData.username,
        userData.email,
        userData.password
      );

      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User.create).toHaveBeenCalledWith({
        username: userData.username,
        email: userData.email,
        password: expect.any(String),
      });
      expect(result.email).toBe(userData.email);
    });

    it('should throw UserCreateError when email is already taken', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123',
      };

      (User.findOne as jest.Mock).mockResolvedValue({ email: userData.email });

      await expect(
        UsersService.createUser(
          userData.username,
          userData.email,
          userData.password
        )
      ).rejects.toThrow(UserCreateError);
      expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
      };

      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnValue(mockUser),
      }));

      const result = await UsersService.getUserByEmail('test@example.com');

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnValue(null),
      }));

      const result = await UsersService.getUserByEmail(
        'nonexistent@example.com'
      );

      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        _id: new ObjectId(),
        email: 'test@example.com',
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await UsersService.getUserById(mockUser._id);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const result = await UsersService.getUserById(new ObjectId());

      expect(result).toBeNull();
    });
  });
});
