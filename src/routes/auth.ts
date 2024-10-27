import { Router } from 'express';
import type { Request, Response } from 'express';
import AuthController from '@/controllers/AuthController';

const authRouter = Router();
const authController = new AuthController();

export interface LoginRequestBody {
  username: string;
  password: string;
}

interface SuccessResponse {
  token: string;
}

interface ErrorResponse {
  message: string;
}

authRouter.post(
  '/login',
  (
    req: Request<never, SuccessResponse | ErrorResponse, LoginRequestBody>,
    res: Response<SuccessResponse | ErrorResponse>,
  ): void => {
    authController.login(req.body, res);
  },
);

export default authRouter;
