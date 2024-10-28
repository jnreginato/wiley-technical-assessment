/**
 * @openapi
 * components:
 *   schemas:
 *     CourseRequestPathParams:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the course
 *           example: "1"
 *       required:
 *         - id
 */
import type { ParamsDictionary } from 'express-serve-static-core';

export default interface CourseRequestPathParams extends ParamsDictionary {
  id: string;
}
