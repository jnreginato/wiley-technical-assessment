import dotenv from 'dotenv';
import type LoginRequestBody from '@/application/requests/LoginRequestBody';
import type { Response } from 'express';
import AuthController from '@/application/controllers/AuthController';

dotenv.config();

describe('AuthController', (): void => {
  let authController: AuthController;
  let mockResponse: Response;

  beforeEach((): void => {
    authController = new AuthController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  it('should return 401 for invalid credentials', (): void => {
    const mockRequest: LoginRequestBody = {
      username: 'wrongUser',
      password: 'wrongPassword',
    };

    authController.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid credentials',
    });
  });

  it('should return 500 if JWT secret is not configured', (): void => {
    const mockRequest: LoginRequestBody = {
      username: 'admin',
      password: 'password',
    };

    delete process.env.JWT_SECRET;

    authController.login(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'JWT secret not configured',
    });
  });

  it('should return a token for valid credentials', (): void => {
    const mockRequest: LoginRequestBody = {
      username: process.env.TEST_USERNAME ?? '',
      password: process.env.TEST_PASSWORD ?? '',
    };

    process.env.JWT_SECRET = 'jwt_secret';
    process.env.JWT_EXPIRATION_TIME = '10s';

    authController.login(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        token: expect.stringMatching(
          /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/,
        ),
      }),
    );
  });
});
