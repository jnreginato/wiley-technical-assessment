import type CourseRequestBody from '@/application/requests/CourseRequestBody';
import type CourseRequestPathParams from '@/application/requests/CourseRequestPathParams';
import type CourseRequestQueryParams from '@/application/requests/CourseRequestQueryParams';
import type { Response } from 'express';
import CourseController from '@/application/controllers/CourseController';
import CourseEntity from '@/domain/entities/CourseEntity';
import CourseRepository from '@/infrastructure/repositories/CourseRepository';

jest.mock('@/infrastructure/repositories/CourseRepository', () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

describe('CourseController', (): void => {
  let courseController: CourseController;
  let mockResponse: Partial<Response>;

  beforeEach((): void => {
    courseController = new CourseController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn(),
    } as Partial<Response>;
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it('should create a course and return it', (): void => {
    // 🔧 ARRANGE
    const mockRequest: CourseRequestBody = {
      title: 'Test Course',
      description: 'This is a test course',
      duration: 3,
      instructor: 'Instructor Name',
    };

    (CourseRepository.create as jest.Mock).mockReturnValue(1);

    // 🚀 ACT
    courseController.createCourse(mockRequest, mockResponse as Response);

    // 👀 ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      id: 1,
      ...mockRequest,
    });
  });

  it('should get all courses', (): void => {
    // 🔧 ARRANGE
    const mockRequest: CourseRequestQueryParams = {
      filter: '',
      sort: '',
      page: '',
    };

    const mockCourses = [
      new CourseEntity('Test Course 1', 'Description 1', 1, 'Instructor 1', 1),
      new CourseEntity('Test Course 2', 'Description 2', 2, 'Instructor 2', 2),
    ];

    (CourseRepository.findAll as jest.Mock).mockReturnValue(mockCourses);

    // 🚀 ACT
    courseController.getCourses(mockRequest, mockResponse as Response);

    // 👀 ASSERT
    expect(mockResponse.json).toHaveBeenCalledWith(mockCourses);
  });

  it('should get a course by id', (): void => {
    // 🔧 ARRANGE
    const mockRequest: CourseRequestPathParams = { id: '1' };
    const mockCourse = new CourseEntity(
      'Test Course',
      'This is a test course',
      3,
      'Instructor Name',
      1,
    );

    (CourseRepository.findById as jest.Mock).mockReturnValue(mockCourse);

    // 🚀 ACT
    courseController.getCourseById(mockRequest, mockResponse as Response);

    // 👀 ASSERT
    expect(mockResponse.json).toHaveBeenCalledWith(mockCourse);
  });

  it('should return 404 if course not found by id', (): void => {
    // 🔧 ARRANGE
    const mockRequest: CourseRequestPathParams = { id: '999' };

    (CourseRepository.findById as jest.Mock).mockReturnValue(null);

    // 🚀 ACT
    courseController.getCourseById(mockRequest, mockResponse as Response);

    // 👀 ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Course not found',
    });
  });

  it('should update an existing course and return it', (): void => {
    // 🔧 ARRANGE
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

    (CourseRepository.update as jest.Mock).mockReturnValue(true);

    // 🚀 ACT
    courseController.updateCourse(
      mockRequestParams,
      mockRequestBody,
      mockResponse as Response,
    );

    // 👀 ASSERT
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedCourse);
  });

  it('should return 404 if course not found on update', (): void => {
    // 🔧 ARRANGE
    const mockRequestParams: CourseRequestPathParams = { id: '999' };
    const mockRequestBody: CourseRequestBody = {
      title: 'Nonexistent Course',
      description: 'This course does not exist',
      duration: 3,
      instructor: 'Instructor Name',
    };

    (CourseRepository.update as jest.Mock).mockReturnValue(false);

    // 🚀 ACT
    courseController.updateCourse(
      mockRequestParams,
      mockRequestBody,
      mockResponse as Response,
    );

    // 👀 ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Course not found',
    });
  });

  it('should delete a course and return 204', (): void => {
    // 🔧 ARRANGE
    const mockRequest: CourseRequestPathParams = { id: '1' };

    (CourseRepository.delete as jest.Mock).mockReturnValue(true);

    // 🚀 ACT
    courseController.deleteCourse(mockRequest, mockResponse as Response);

    // 👀 ASSERT
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
  });

  it('should return 404 if course not found on delete', (): void => {
    // 🔧 ARRANGE
    const mockRequest: CourseRequestPathParams = { id: '999' };

    (CourseRepository.delete as jest.Mock).mockReturnValue(false);

    // 🚀 ACT
    courseController.deleteCourse(mockRequest, mockResponse as Response);

    // 👀 ASSERT
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Course not found',
    });
  });
});
