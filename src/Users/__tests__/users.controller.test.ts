import { Request, Response } from 'express';
import { loginUser, postUsers, logoutUser } from '../users.controller';
import UsersService from '../users.service';
import User from '../User.model';
import { AuthService } from '../../auth/auth.service';

// Mock services
jest.mock('../User.model');
jest.mock('../users.service');
jest.mock('../../auth/auth.service');

describe('Users Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      body: {},
      cookies: {},
    };
    mockRes = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should set cookie and return user data on successful login', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
      };

      (AuthService.prototype.login as jest.Mock).mockResolvedValue({
        user: mockUser,
      });
      mockReq.body = { email: 'test@example.com', password: 'password123' };

      await loginUser(mockReq as Request, mockRes as Response, mockNext);

      expect(AuthService.prototype.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        mockRes
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        user: {
          _id: '123',
          username: 'testuser',
          email: 'test@example.com',
          createdAt: expect.any(Date),
        },
      });
    });

    it('should call next with error on invalid credentials', async () => {
      (AuthService.prototype.login as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );
      mockReq.body = { email: 'test@example.com', password: 'wrongpass' };

      await loginUser(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(new Error('Invalid credentials'));
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('logoutUser', () => {
    it('should clear cookie and return success message', async () => {
      (AuthService.prototype.logout as jest.Mock).mockResolvedValue({
        message: 'Logout successful',
      });

      await logoutUser(mockReq as Request, mockRes as Response, mockNext);

      expect(AuthService.prototype.logout).toHaveBeenCalledWith(mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Logout successful',
      });
    });

    it('should handle logout errors', async () => {
      (AuthService.prototype.logout as jest.Mock).mockRejectedValue(
        new Error('Logout failed')
      );

      await logoutUser(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('postUsers', () => {
    it('should create user and return user data', async () => {
      const mockUser = {
        _id: '123',
        username: 'newuser',
        email: 'new@example.com',
        createdAt: new Date(),
      };

      (UsersService.createUser as jest.Mock).mockResolvedValue(mockUser);
      (AuthService.prototype.login as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      mockReq.body = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      await postUsers(mockReq as Request, mockRes as Response, mockNext);

      expect(UsersService.createUser).toHaveBeenCalledWith(
        'newuser',
        'new@example.com',
        'password123'
      );
      expect(AuthService.prototype.login).toHaveBeenCalledWith(
        'new@example.com',
        'password123',
        mockRes
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: mockUser,
      });
    });
  });
});
