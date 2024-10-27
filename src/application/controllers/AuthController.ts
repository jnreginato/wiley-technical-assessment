import jwt from 'jsonwebtoken';
import type LoginRequestBody from '@/application/requests/LoginRequestBody';
import type { Response } from 'express';

export default class AuthController {
  // Simulate a hardcoded user
  private user = {
    username: 'admin',
    password: 'password',
  };

  public login(input: LoginRequestBody, res: Response): object {
    const { username, password } = input;
    if (username !== this.user.username || password !== this.user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign({}, secret, {
      subject: JSON.stringify({
        username,
      }),
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    return res.json({ token });
  }
}
