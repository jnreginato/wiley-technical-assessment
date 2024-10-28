import type { Query } from 'express-serve-static-core';

/**
 * @openapi
 * components:
 *   schemas:
 *     CourseRequestQueryParams:
 *       type: object
 *       properties:
 *         filter:
 *           type: string
 *           description: Filter courses by title or description
 *           example: "programming"
 *         sort:
 *           type: string
 *           description: Sort courses by a specific field (e.g., title or duration)
 *           example: "title"
 *         page:
 *           type: string
 *           description: The page number for pagination
 *           example: "1"
 */
export default interface CourseRequestQueryParams extends Query {
  filter: string;
  sort: string;
  page: string;
}
