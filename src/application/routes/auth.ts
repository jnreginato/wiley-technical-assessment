import { Router } from 'express';
import type LoginRequestBody from '@/application/requests/LoginRequestBody';
import type ErrorResponse from '@/application/responses/ErrorResponse';
import type LoginResponse from '@/application/responses/LoginResponse';
import type { Request, Response } from 'express';
import AuthController from '@/application/controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/login',
  (
    req: Request<never, LoginResponse | ErrorResponse, LoginRequestBody>,
    res: Response<LoginResponse | ErrorResponse>,
  ): void => {
    authController.login(req.body, res);
  },
);

export default authRouter;
