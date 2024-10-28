/**
 * @openapi
 * components:
 *   schemas:
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "jwt_token"
 */
export default interface LoginResponse {
  token: string;
}
