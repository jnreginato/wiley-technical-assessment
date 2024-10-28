/**
 * @openapi
 * components:
 *   schemas:
 *     CourseRequestBody:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the course
 *           example: "Introduction to programming"
 *         description:
 *           type: string
 *           description: A brief description of the course content
 *           example: "Learn the basics of programming with hands-on examples."
 *         duration:
 *           type: integer
 *           description: The duration of the course in minutes
 *           example: 120
 *         instructor:
 *           type: string
 *           description: The name of the course instructor
 *           example: "John Doe"
 *       required:
 *         - title
 *         - duration
 *         - instructor
 */
export default interface CourseRequestBody {
  title: string;
  description: string;
  duration: number;
  instructor: string;
}
