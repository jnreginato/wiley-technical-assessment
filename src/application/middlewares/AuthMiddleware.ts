import { verify } from 'jsonwebtoken';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export interface TokenCredentials {
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenCredentials;
    }
  }
}

export default class AuthMiddleware {
  public process: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const token: string | null = this.extractTokenFromHeader(req);
    if (token === null) {
      res.status(401).json({ message: 'Token not sent.' });
      return;
    }

    const secret: string | undefined = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: 'JWT secret not configured' });
      return;
    }

    try {
      const decoded: string | JwtPayload = verify(token, secret);
      const sub: string = (decoded as ITokenPayload).sub;
      const parsedSub = JSON.parse(sub.toString()) as TokenCredentials;
      req.user = {
        username: parsedSub.username,
      };
      next();
    } catch (error) {
      console.error(
        'JWT verification error:',
        error instanceof Error ? error.message : error,
      );
      res.status(403).json({ message: 'Invalid token.' });
      return;
    }
  };

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader: string | undefined = request.headers.authorization;
    if (authHeader === undefined) {
      return null;
    }

    if (!authHeader.startsWith('Bearer ')) {
      return null;
    }

    const [, token] = authHeader.split(' ');

    return token;
  }
}
