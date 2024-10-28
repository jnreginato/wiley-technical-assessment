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

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseRequestBody'
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Retrieve a list of courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Filter courses by title
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort courses by a specified field
 *       - in: query
 *         name: page
 *         schema:
 *           type: string
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseResponse'
 */
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

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Retrieve a single course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to retrieve
 *     responses:
 *       200:
 *         description: Course details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update an existing course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseRequestBody'
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseResponse'
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the course to delete
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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
