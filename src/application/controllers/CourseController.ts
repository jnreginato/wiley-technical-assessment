import type CourseRequestBody from '@/application/requests/CourseRequestBody';
import type CourseRequestPathParams from '@/application/requests/CourseRequestPathParams';
import type CourseRequestQueryParams from '@/application/requests/CourseRequestQueryParams';
import type CourseResponse from '@/application/responses/CourseResponse';
import type { Response } from 'express';
import CourseEntity from '@/domain/entities/CourseEntity';
import CourseRepository from '@/infrastructure/repositories/CourseRepository';

export default class CourseController {
  public createCourse(input: CourseRequestBody, res: Response): void {
    const { title, description, duration, instructor } = input;
    const course = new CourseEntity(title, description, duration, instructor);
    const id = CourseRepository.create(course);

    res.status(201).json({
      id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      instructor: course.instructor,
    });
  }

  public getCourses(_input: CourseRequestQueryParams, res: Response): void {
    const courses = CourseRepository.findAll();
    res.json(courses);
  }

  public getCourseById(input: CourseRequestPathParams, res: Response): void {
    const { id } = input;
    const course = CourseRepository.findById(Number(id));

    if (course === null) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json(course as CourseResponse);
  }

  public updateCourse(
    params: CourseRequestPathParams,
    body: CourseRequestBody,
    res: Response,
  ): void {
    const { id } = params;
    const { title, description, duration, instructor } = body;

    const course = new CourseEntity(
      title,
      description,
      duration,
      instructor,
      Number(id),
    );
    const success = CourseRepository.update(course);

    if (!success) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json({ id, title, description, duration, instructor });
  }

  public deleteCourse(input: CourseRequestPathParams, res: Response): void {
    const { id } = input;
    const success = CourseRepository.delete(Number(id));

    if (!success) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.sendStatus(204);
  }
}
