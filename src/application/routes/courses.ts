import { Router } from 'express';
import { body, param, query } from 'express-validator';
import type CourseRequestBody from '@/application/requests/CourseRequestBody';
import type CourseRequestPathParams from '@/application/requests/CourseRequestPathParams';
import type CourseRequestQueryParams from '@/application/requests/CourseRequestQueryParams';
import type CourseResponse from '@/application/responses/CourseResponse';
import type ErrorResponse from '@/application/responses/ErrorResponse';
import type { Request, Response } from 'express';
import CourseController from '@/application/controllers/CourseController';
import AuthMiddleware from '@/application/middlewares/AuthMiddleware';
import InputValidationMiddleware from '@/application/middlewares/InputValidationMiddleware';

const coursesRouter = Router();
const authMiddleware = new AuthMiddleware();
const inputValidationMiddleware = new InputValidationMiddleware();
const courseController = new CourseController();

// Validations for creating and updating courses
const courseValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer'),
  body('instructor').notEmpty().withMessage('Instructor is required'),
];

// Create a course
coursesRouter.post(
  '/courses',
  authMiddleware.process,
  courseValidationRules,
  inputValidationMiddleware.process,
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
  [
    query('filter')
      .optional()
      .isString()
      .withMessage('Filter must be a string'),
    query('sort').optional().isString().withMessage('Sort must be a string'),
    query('page').optional().isString().withMessage('Page must be a string'),
  ],
  inputValidationMiddleware.process,
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
  [param('id').isInt().withMessage('Course ID must be an integer')],
  inputValidationMiddleware.process,
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
  [
    param('id').isInt().withMessage('Course ID must be an integer'),
    ...courseValidationRules,
  ],
  inputValidationMiddleware.process,
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
  [param('id').isInt().withMessage('Course ID must be an integer')],
  inputValidationMiddleware.process,
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
