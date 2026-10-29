import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service.js';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseService],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getAllCourses returns message and data', () => {
    expect(service.getAllCourses()).toEqual({
      message: 'All courses fetched successfully',
      data: [],
    });
  });

  it('getCourseById returns message and id', () => {
    expect(service.getCourseById('5')).toEqual({
      message: 'Course fetched successfully',
      id: '5',
    });
  });

  it('createCourse returns message and the full dto', () => {
    const dto = {
      name: 'NestJS Fundamentals',
      code: 'CS101',
      instructor: 'John Doe',
      credits: 3,
    };
    expect(service.createCourse(dto)).toEqual({
      message: 'Course created successfully',
      data: dto,
    });
  });

  it('updateCourse returns message, id and data', () => {
    const dto = { name: 'NestJS Advanced', code: 'CS201' };
    expect(service.updateCourse('5', dto)).toEqual({
      message: 'Course updated successfully',
      id: '5',
      data: dto,
    });
  });

  it('patchCourse returns message, id and updated fields', () => {
    expect(service.patchCourse('5', { name: 'NestJS', credits: 4 })).toEqual({
      message: 'Course patched successfully',
      id: '5',
      updatedFields: ['name', 'credits'],
    });
  });

  it('deleteCourse returns message and id', () => {
    expect(service.deleteCourse('5')).toEqual({
      message: 'Course deleted successfully',
      id: '5',
    });
  });

  it('uploadCourseMaterial returns message, courseId, filename and path', () => {
    const file = {
      filename: '1234567890-notes.pdf',
      path: 'uploads/1234567890-notes.pdf',
    } as Express.Multer.File;
    expect(service.uploadCourseMaterial('5', file)).toEqual({
      message: 'Material uploaded successfully',
      courseId: '5',
      filename: '1234567890-notes.pdf',
      path: 'uploads/1234567890-notes.pdf',
    });
  });

  it('uploadCourseMaterial rejects a missing file', () => {
    expect(() =>
      service.uploadCourseMaterial(
        '5',
        undefined as unknown as Express.Multer.File,
      ),
    ).toThrow(BadRequestException);
  });
});
