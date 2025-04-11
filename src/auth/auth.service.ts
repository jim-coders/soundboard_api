import jwt from 'jsonwebtoken';
import UserService from '../Users/users.service';
import { Response } from 'express';

export class AuthService {
  constructor(private userService: typeof UserService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.loginUser(username, password);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, res: Response) {
    const payload = { username: user.username, sub: user._id };

    // Generate JWT token (keeping existing functionality)
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    // Set HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return { token, message: 'Login successful' };
  }

  async logout(res: Response) {
    // Clear both token and cookie
    res.clearCookie('auth_token');
    return { message: 'Logout successful' };
  }
}
