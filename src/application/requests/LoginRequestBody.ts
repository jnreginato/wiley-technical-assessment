/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequestBody:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: "admin"
 *         password:
 *           type: string
 *           example: "password"
 *       required:
 *         - username
 *         - password
 */
export default interface LoginRequestBody {
  username: string;
  password: string;
}
