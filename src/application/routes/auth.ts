import { Router } from 'express';
import { body } from 'express-validator';
import type LoginRequestBody from '@/application/requests/LoginRequestBody';
import type ErrorResponse from '@/application/responses/ErrorResponse';
import type LoginResponse from '@/application/responses/LoginResponse';
import type { Request, Response } from 'express';
import AuthController from '@/application/controllers/AuthController';
import InputValidationMiddleware from '@/application/middlewares/InputValidationMiddleware';

const authRouter = Router();
const inputValidationMiddleware = new InputValidationMiddleware();
const authController = new AuthController();

authRouter.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  inputValidationMiddleware.process,
  (
    req: Request<never, LoginResponse | ErrorResponse, LoginRequestBody>,
    res: Response<LoginResponse | ErrorResponse>,
  ): void => {
    authController.login(req.body, res);
  },
);

export default authRouter;
