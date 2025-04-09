import UsersService from '../users.service';
import { UserCreateError } from '../errors';
import User from '../User.model';
import { ObjectId } from 'mongodb';

// Mock User model
jest.mock('../User.model', () => {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
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

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));

      const result = await UsersService.loginUser(
        'test@example.com',
        'password123'
      );

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(null),
      }));

      await expect(
        UsersService.loginUser('test@example.com', 'password123')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error when password is invalid', async () => {
      const mockUser = {
        _id: '123',
        email: 'test@example.com',
        password: 'hashedPassword',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser),
      }));

      await expect(
        UsersService.loginUser('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
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

  describe('getManyUsers', () => {
    it('should return list of users', async () => {
      const mockUsers = [
        { _id: new ObjectId(), email: 'user1@example.com' },
        { _id: new ObjectId(), email: 'user2@example.com' },
      ];

      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await UsersService.getManyUsers();

      expect(User.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });
});
