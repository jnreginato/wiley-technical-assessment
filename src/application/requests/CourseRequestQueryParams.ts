import type { Query } from 'express-serve-static-core';

export default interface CourseRequestQueryParams extends Query {
  search: string;
  sortBy: string;
}
