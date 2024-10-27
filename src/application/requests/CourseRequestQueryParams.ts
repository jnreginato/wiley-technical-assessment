import type { Query } from 'express-serve-static-core';

export default interface CourseRequestQueryParams extends Query {
  filter: string;
  sort: string;
  page: string;
}
