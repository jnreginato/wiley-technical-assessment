import CourseEntity from '@/domain/entities/CourseEntity';
import db from '@/infrastructure/data-source/database/sqlite';

interface DatabaseCourseData {
  id: number;
  title: string;
  description: string;
  duration: number;
  instructor: string;
}

class CourseRepository {
  public create(course: CourseEntity): number {
    const stmt = db.prepare(`
      INSERT INTO courses (title, description, duration, instructor)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(
      course.title,
      course.description,
      course.duration,
      course.instructor,
    );

    return result.lastInsertRowid as number;
  }

  public findAll(): CourseEntity[] {
    const stmt = db.prepare(`SELECT * FROM courses`);
    const rows = stmt.all() as DatabaseCourseData[];

    return rows.map(
      (row) =>
        new CourseEntity(
          row.title,
          row.description,
          row.duration,
          row.instructor,
          row.id,
        ),
    );
  }

  public findById(id: number): CourseEntity | null {
    const stmt = db.prepare(`SELECT * FROM courses WHERE id = ?`);
    const row = stmt.get(id) as DatabaseCourseData | undefined;

    if (row) {
      return new CourseEntity(
        row.title,
        row.description,
        row.duration,
        row.instructor,
        row.id,
      );
    }

    return null;
  }

  public update(course: CourseEntity): boolean {
    const stmt = db.prepare(`
      UPDATE courses
      SET title = ?, description = ?, duration = ?, instructor = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      course.title,
      course.description,
      course.duration,
      course.instructor,
      course.id,
    );

    return result.changes > 0;
  }

  public delete(id: number): boolean {
    const stmt = db.prepare(`DELETE FROM courses WHERE id = ?`);
    const result = stmt.run(id);

    return result.changes > 0;
  }
}

export default new CourseRepository();
