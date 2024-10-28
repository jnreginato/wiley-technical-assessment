import { validationResult } from 'express-validator';
import type { NextFunction, Request, Response } from 'express';
import InputValidationMiddleware from '@/application/middlewares/InputValidationMiddleware';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('InputValidationMiddleware', (): void => {
  let inputValidationMiddleware: InputValidationMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    inputValidationMiddleware = new InputValidationMiddleware();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if there are validation errors', async (): Promise<void> => {
    // 🔧 ARRANGE
    const mockErrors = {
      isEmpty: jest.fn().mockReturnValue(false),
      array: jest.fn().mockReturnValue([{ msg: 'Invalid value' }]),
    };

    (validationResult as unknown as jest.Mock).mockReturnValue(mockErrors);

    // 🚀 ACT
    await inputValidationMiddleware.process(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // 👀 ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: 'Invalid value' }],
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() if there are no validation errors', async (): Promise<void> => {
    // 🔧 ARRANGE
    const mockErrors = {
      isEmpty: jest.fn().mockReturnValue(true),
    };

    (validationResult as unknown as jest.Mock).mockReturnValue(mockErrors);

    // 🚀 ACT
    await inputValidationMiddleware.process(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    // 👀 ASSERT
    expect(mockNext).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});
