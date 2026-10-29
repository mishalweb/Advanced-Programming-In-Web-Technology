import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller.js';
import { CourseService } from './course.service.js';

describe('CourseController', () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [CourseService],
    }).compile();

    controller = module.get<CourseController>(CourseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates every route to CourseService', () => {
    expect(controller.getAllCourses().message).toBe('All courses fetched');
    expect(controller.getCourseById('101').id).toBe('101');
    expect(controller.createCourse('NestJS', 'CS301').data).toEqual({
      name: 'NestJS',
      code: 'CS301',
    });
  });
});
