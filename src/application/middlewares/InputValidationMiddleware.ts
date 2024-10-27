import { validationResult } from 'express-validator';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

export default class InputValidationMiddleware {
  public process: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    next();
  };
}
