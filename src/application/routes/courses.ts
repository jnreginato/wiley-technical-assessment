// eslint-disable-next-line import/no-duplicates
import { type Request, Router } from 'express';
import type CourseRequestBody from '@/application/requests/CourseRequestBody';
import type CourseRequestPathParams from '@/application/requests/CourseRequestPathParams';
import type CourseRequestQueryParams from '@/application/requests/CourseRequestQueryParams';
import type CourseResponse from '@/application/responses/CourseResponse';
import type ErrorResponse from '@/application/responses/ErrorResponse';
// eslint-disable-next-line import/no-duplicates
import type { Response } from 'express';
import AuthMiddleware from '@/application/middlewares/AuthMiddleware';
import { courses } from '@/application/responses/CourseResponse';

const coursesRouter = Router();
const authMiddleware = new AuthMiddleware();

// Create a course
coursesRouter.post(
  '/courses',
  authMiddleware.process,
  (
    req: Request<never, CourseResponse, CourseRequestBody, never>,
    res: Response<CourseResponse>,
  ) => {
    const course: CourseRequestBody = req.body;
    const courseEntity = { ...course, id: courses.length + 1 };
    courses.push(courseEntity);
    res.status(201).json(courseEntity);
  },
);

// Read courses
coursesRouter.get(
  '/courses',
  authMiddleware.process,
  (
    _req: Request<never, CourseResponse[], never, CourseRequestQueryParams>,
    res: Response<CourseResponse[]>,
  ) => {
    res.json(courses);
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
  ) => {
    const { id } = req.params;
    const course = courses.find((c) => c.id === parseInt(id));
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
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
  ) => {
    const { id } = req.params;
    const course = courses.find((c) => c.id === parseInt(id));
    if (course === undefined) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }
    Object.assign(course, req.body);
    res.json(course);
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
    const { id } = req.params;
    const index = courses.findIndex((c) => c.id === parseInt(id));
    if (index === -1) {
      res.status(404).json({ message: 'Course not found' });
    }
    courses.splice(index, 1);
    res.sendStatus(204);
  },
);

export default coursesRouter;
