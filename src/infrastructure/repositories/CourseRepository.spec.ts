import CourseEntity from '@/domain/entities/CourseEntity';
import db from '@/infrastructure/data-source/database/sqlite';
import CourseRepository from '@/infrastructure/repositories/CourseRepository';

jest.mock('@/infrastructure/data-source/database/sqlite', () => ({
  prepare: jest.fn(),
}));

describe('CourseRepository', (): void => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a course and return its ID', (): void => {
    // 🔧 ARRANGE
    const course = new CourseEntity(
      'Test Course',
      'This is a test course',
      3,
      'Instructor Name',
    );

    const mockStmt = {
      run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    // 🚀 ACT
    const id = CourseRepository.create(course);

    // 👀 ASSERT
    expect(mockStmt.run).toHaveBeenCalledWith(
      course.title,
      course.description,
      course.duration,
      course.instructor,
    );
    expect(id).toBe(1);
  });

  it('should find all courses', (): void => {
    // 🔧 ARRANGE
    const mockCourses = [
      {
        id: 1,
        title: 'Course 1',
        description: 'Description 1',
        duration: 1,
        instructor: 'Instructor 1',
      },
      {
        id: 2,
        title: 'Course 2',
        description: 'Description 2',
        duration: 2,
        instructor: 'Instructor 2',
      },
    ];

    (db.prepare as jest.Mock).mockReturnValue({
      all: jest.fn().mockReturnValue(mockCourses),
    });

    // 🚀 ACT
    const courses = CourseRepository.findAll();

    // 👀 ASSERT
    expect(courses.length).toBe(2);
    expect(courses[0]).toBeInstanceOf(CourseEntity);
    expect(courses[0].title).toBe('Course 1');
  });

  it('should find a course by id', (): void => {
    // 🔧 ARRANGE
    const mockCourse = {
      id: 1,
      title: 'Test Course',
      description: 'This is a test course',
      duration: 3,
      instructor: 'Instructor Name',
    };

    (db.prepare as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(mockCourse),
    });

    // 🚀 ACT
    const course = CourseRepository.findById(1);

    // 👀 ASSERT
    expect(course).toBeInstanceOf(CourseEntity);
    expect(course?.title).toBe('Test Course');
  });

  it('should return null if course not found by id', (): void => {
    // 🔧 ARRANGE
    (db.prepare as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    // 🚀 ACT
    const course = CourseRepository.findById(999);

    // 👀 ASSERT
    expect(course).toBeNull();
  });

  it('should update an existing course and return true', (): void => {
    // 🔧 ARRANGE
    const course = new CourseEntity(
      'Updated Course',
      'Updated description',
      4,
      'Updated Instructor',
      1,
    );

    const mockStmt = {
      run: jest.fn().mockReturnValue({ changes: 1 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    // 🚀 ACT
    const success = CourseRepository.update(course);

    // 👀 ASSERT
    expect(mockStmt.run).toHaveBeenCalledWith(
      course.title,
      course.description,
      course.duration,
      course.instructor,
      course.id,
    );
    expect(success).toBe(true);
  });

  it('should return false if course not found on update', (): void => {
    // 🔧 ARRANGE
    const course = new CourseEntity(
      'Nonexistent Course',
      'This course does not exist',
      3,
      'Instructor Name',
      999,
    );

    const mockStmt = {
      run: jest.fn().mockReturnValue({ changes: 0 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    // 🚀 ACT
    const success = CourseRepository.update(course);

    // 👀 ASSERT
    expect(mockStmt.run).toHaveBeenCalledWith(
      course.title,
      course.description,
      course.duration,
      course.instructor,
      course.id,
    );
    expect(success).toBe(false);
  });

  it('should delete a course and return true', (): void => {
    // 🔧 ARRANGE
    const mockStmt = {
      run: jest.fn().mockReturnValue({ changes: 1 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    // 🚀 ACT
    const success = CourseRepository.delete(1);

    // 👀 ASSERT
    expect(mockStmt.run).toHaveBeenCalledWith(1);
    expect(success).toBe(true);
  });

  it('should return false if course not found on delete', (): void => {
    // 🔧 ARRANGE
    const mockStmt = {
      run: jest.fn().mockReturnValue({ changes: 0 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    // 🚀 ACT
    const success = CourseRepository.delete(999);

    // 👀 ASSERT
    expect(mockStmt.run).toHaveBeenCalledWith(999);
    expect(success).toBe(false);
  });
});
