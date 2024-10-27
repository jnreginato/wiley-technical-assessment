// eslint-disable-next-line import/no-duplicates
import { type Request, Router } from 'express';
import type CourseRequestBody from '@/application/requests/CourseRequestBody';
import type CourseRequestPathParams from '@/application/requests/CourseRequestPathParams';
import type CourseRequestQueryParams from '@/application/requests/CourseRequestQueryParams';
import type CourseResponse from '@/application/responses/CourseResponse';
import type ErrorResponse from '@/application/responses/ErrorResponse';
// eslint-disable-next-line import/no-duplicates
import type { Response } from 'express';
import CourseController from '@/application/controllers/CourseController';
import AuthMiddleware from '@/application/middlewares/AuthMiddleware';

const coursesRouter = Router();
const authMiddleware = new AuthMiddleware();
const courseController = new CourseController();

// Create a course
coursesRouter.post(
  '/courses',
  authMiddleware.process,
  (
    req: Request<never, CourseResponse, CourseRequestBody, never>,
    res: Response<CourseResponse>,
  ): void => {
    courseController.createCourse(req.body, res);
  },
);

// Read courses
coursesRouter.get(
  '/courses',
  authMiddleware.process,
  (
    req: Request<never, CourseResponse[], never, CourseRequestQueryParams>,
    res: Response<CourseResponse[]>,
  ): void => {
    courseController.getCourses(req.query, res);
  },
);

// Read a single course
coursesRouter.get(
  '/courses/:id',
  authMiddleware.process,
  (
    req: Request<
      CourseRequestPathParams,
      CourseResponse | ErrorResponse,
      never,
      never
    >,
    res: Response<CourseResponse | ErrorResponse>,
  ): void => {
    courseController.getCourseById(req.params, res);
  },
);

// Update a course
coursesRouter.put(
  '/courses/:id',
  authMiddleware.process,
  (
    req: Request<
      CourseRequestPathParams,
      CourseResponse | ErrorResponse,
      CourseRequestBody,
      never
    >,
    res: Response<CourseResponse | ErrorResponse>,
  ): void => {
    courseController.updateCourse(req.params, req.body, res);
  },
);

// Delete a course
coursesRouter.delete(
  '/courses/:id',
  authMiddleware.process,
  (
    req: Request<
      CourseRequestPathParams,
      CourseResponse | ErrorResponse,
      never,
      never
    >,
    res: Response<CourseResponse | ErrorResponse>,
  ) => {
    courseController.deleteCourse(req.params, res);
  },
);

export default coursesRouter;
