export default interface CourseResponse {
  id: number;
  title: string;
  description: string;
  duration: number;
  instructor: string;
}

export const courses: CourseResponse[] = [];
