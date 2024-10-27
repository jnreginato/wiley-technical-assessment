import type CourseRequestBody from '@/application/requests/CourseRequestBody';
import type CourseRequestPathParams from '@/application/requests/CourseRequestPathParams';
import type CourseRequestQueryParams from '@/application/requests/CourseRequestQueryParams';
import type { Response } from 'express';
import CourseController from '@/application/controllers/CourseController';
import db from '@/infrastructure/data-source/database/sqlite';

jest.mock('@/infrastructure/data-source/database/sqlite', () => ({
  prepare: jest.fn(),
}));

describe('CourseController', () => {
  let courseController: CourseController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    courseController = new CourseController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    } as Partial<Response>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a course and return it', () => {
    const mockRequest: CourseRequestBody = {
      title: 'Test Course',
      description: 'This is a test course',
      duration: 3,
      instructor: 'Instructor Name',
    };

    const mockStmt = {
      run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    courseController.createCourse(mockRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 1,
      title: mockRequest.title,
      description: mockRequest.description,
      duration: mockRequest.duration,
      instructor: mockRequest.instructor,
    });
  });

  it('should get all courses', () => {
    const mockRequest: CourseRequestQueryParams = {
      search: '',
      sortBy: '',
    };

    const mockCourses = [
      {
        id: 1,
        title: 'Test Course 1',
        description: 'Description 1',
        duration: '1 hour',
        instructor: 'Instructor 1',
      },
      {
        id: 2,
        title: 'Test Course 2',
        description: 'Description 2',
        duration: '2 hours',
        instructor: 'Instructor 2',
      },
    ];

    (db.prepare as jest.Mock).mockReturnValue({
      all: jest.fn().mockReturnValue(mockCourses),
    });

    courseController.getCourses(mockRequest, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(mockCourses);
  });

  it('should get a course by id', () => {
    const mockRequest: CourseRequestPathParams = { id: '1' };

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

    courseController.getCourseById(mockRequest, mockResponse as Response);

    expect(mockResponse.json).toHaveBeenCalledWith(mockCourse);
  });

  it('should return 404 if course not found by id', () => {
    const mockRequest: CourseRequestPathParams = { id: '999' };

    (db.prepare as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    courseController.getCourseById(mockRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Course not found',
    });
  });

  it('should update an existing course and return it', () => {
    const mockRequestParams: CourseRequestPathParams = { id: '1' };
    const mockRequestBody: CourseRequestBody = {
      title: 'Updated Course',
      description: 'Updated description',
      duration: 4,
      instructor: 'Updated Instructor',
    };

    const mockUpdatedCourse = {
      id: '1',
      title: 'Updated Course',
      description: 'Updated description',
      duration: 4,
      instructor: 'Updated Instructor',
    };

    const mockStmt = {
      run: jest.fn().mockReturnValue({ changes: 1 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    courseController.updateCourse(
      mockRequestParams,
      mockRequestBody,
      mockResponse as Response,
    );

    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedCourse);
  });

  it('should return 404 if course not found on update', () => {
    const mockRequestParams: CourseRequestPathParams = { id: '999' };
    const mockRequestBody: CourseRequestBody = {
      title: 'Nonexistent Course',
      description: 'This course does not exist',
      duration: 3,
      instructor: 'Instructor Name',
    };

    const mockStmt = {
      run: jest.fn().mockReturnValue({ changes: 0 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    courseController.updateCourse(
      mockRequestParams,
      mockRequestBody,
      mockResponse as Response,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Course not found',
    });
  });

  it('should delete a course and return 204', () => {
    const mockRequest: CourseRequestPathParams = { id: '1' };

    const mockStmt = {
      run: jest.fn().mockReturnValue({ changes: 1 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    courseController.deleteCourse(mockRequest, mockResponse as Response);

    expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
  });

  it('should return 404 if course not found on delete', () => {
    const mockRequest: CourseRequestPathParams = { id: '999' };

    const mockStmt = {
      run: jest.fn().mockReturnValue({ changes: 0 }),
    };

    (db.prepare as jest.Mock).mockReturnValue(mockStmt);

    courseController.deleteCourse(mockRequest, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Course not found',
    });
  });
});
