import { verify } from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import AuthMiddleware from '@/application/middlewares/AuthMiddleware';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('AuthMiddleware', (): void => {
  let middleware: AuthMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach((): void => {
    middleware = new AuthMiddleware();
    mockRequest = {
      headers: {},
    } as Partial<Request>;
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should return 401 if token is not sent', async (): Promise<void> => {
    // 🚀 ACT
    await middleware.process(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // 👀 ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Token not sent.',
    });
  });

  it('should return 500 if JWT secret is not configured', async (): Promise<void> => {
    // 🔧 ARRANGE
    mockRequest.headers = { authorization: 'Bearer valid_token' };

    delete process.env.JWT_SECRET;

    // 🚀 ACT
    await middleware.process(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // 👀 ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'JWT secret not configured',
    });
  });

  it('should return 403 if token is invalid', async (): Promise<void> => {
    // 🔧 ARRANGE
    mockRequest.headers = { authorization: 'Bearer invalid_token' };
    process.env.JWT_SECRET = 'jwt_secret';
    (verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    // 🚀 ACT
    await middleware.process(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // 👀 ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid token.',
    });
  });

  it('should call next() and attach user if token is valid', async (): Promise<void> => {
    // 🔧 ARRANGE
    mockRequest.headers = { authorization: 'Bearer valid_token' };
    process.env.JWT_SECRET = 'jwt_secret';
    (verify as jest.Mock).mockImplementation(() => {
      return { sub: JSON.stringify({ username: 'admin' }) };
    });

    // 🚀 ACT
    await middleware.process(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // 👀 ASSERT
    expect(mockRequest.user).toEqual({ username: 'admin' });
    expect(mockNext).toHaveBeenCalled();
  });
});
