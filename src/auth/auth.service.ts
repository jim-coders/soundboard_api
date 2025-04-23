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
      console.log('Authentication failed for:', email);
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    console.log('Environment:', isProduction ? 'production' : 'development');

    // Set HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days to match JWT expiration
    };
    console.log('Cookie options:', JSON.stringify(cookieOptions, null, 2));

    res.cookie('auth_token', token, cookieOptions);
    console.log('Cookie set with token:', token.substring(0, 20) + '...');

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
      console.log('Validating token:', token.substring(0, 20) + '...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        username: string;
      };
      console.log('Token decoded successfully:', decoded);
      return {
        userId: new ObjectId(decoded.userId),
        username: decoded.username,
      };
    } catch (error) {
      console.error('Token validation failed:', error);
      throw new Error('Invalid token');
    }
  }
}
