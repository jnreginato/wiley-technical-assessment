import type CourseRequestBody from '@/application/requests/CourseRequestBody';
import type CourseRequestPathParams from '@/application/requests/CourseRequestPathParams';
import type CourseRequestQueryParams from '@/application/requests/CourseRequestQueryParams';
import type CourseResponse from '@/application/responses/CourseResponse';
import type { Response } from 'express';
import db from '@/infrastructure/data-source/database/sqlite';

export default class CourseController {
  public createCourse(input: CourseRequestBody, res: Response): void {
    const { title, description, duration, instructor } = input;

    const stmt = db.prepare(`
      INSERT INTO courses (title, description, duration, instructor)
      VALUES (?, ?, ?, ?)
    `);

    const info = stmt.run(title, description, duration, instructor);
    res.status(201).json({
      id: info.lastInsertRowid,
      title,
      description,
      duration,
      instructor,
    });
  }

  public getCourses(_input: CourseRequestQueryParams, res: Response): void {
    const stmt = db.prepare(`SELECT * FROM courses`);
    const courses = stmt.all() as CourseResponse[];
    res.json(courses);
  }

  public getCourseById(input: CourseRequestPathParams, res: Response): void {
    const { id } = input;
    const stmt = db.prepare(`SELECT * FROM courses WHERE id = ?`);
    const course = stmt.get(id);

    if (course === undefined) {
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

    const stmt = db.prepare(`
      UPDATE courses
      SET title = ?, description = ?, duration = ?, instructor = ?
      WHERE id = ?
    `);

    const info = stmt.run(title, description, duration, instructor, id);

    if (info.changes <= 0) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json({ id, title, description, duration, instructor });
  }

  public deleteCourse(input: CourseRequestPathParams, res: Response): void {
    const { id } = input;
    const stmt = db.prepare(`DELETE FROM courses WHERE id = ?`);
    const info = stmt.run(id);

    if (info.changes <= 0) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.sendStatus(204);
  }
}
