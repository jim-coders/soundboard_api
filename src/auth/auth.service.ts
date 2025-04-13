import jwt from 'jsonwebtoken';
import UserService from '../Users/users.service';
import { Response } from 'express';
import { ObjectId } from 'mongodb';

export class AuthService {
  constructor(private userService: typeof UserService) {}

  async login(email: string, password: string, res: Response) {
    // Validate user credentials
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Return only user data
    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async logout(res: Response) {
    res.clearCookie('auth_token');
    return { message: 'Logout successful' };
  }

  async validateToken(
    token: string
  ): Promise<{ userId: ObjectId; username: string }> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        username: string;
      };
      return {
        userId: new ObjectId(decoded.userId),
        username: decoded.username,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
