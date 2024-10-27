import type { ParamsDictionary } from 'express-serve-static-core';

export default interface CourseRequestPathParams extends ParamsDictionary {
  id: string;
}
