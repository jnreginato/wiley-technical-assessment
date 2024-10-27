export default interface CourseResponse {
  id: bigint | number | string;
  title: string;
  description: string;
  duration: number;
  instructor: string;
}

export const courses: CourseResponse[] = [];
