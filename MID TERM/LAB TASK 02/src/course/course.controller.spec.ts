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

  it('delegates every route to the service', () => {
    const dto = {
      name: 'NestJS Fundamentals',
      code: 'CS101',
      instructor: 'John Doe',
      credits: 3,
    };
    expect(controller.getAllCourses().message).toBe(
      'All courses fetched successfully',
    );
    expect(controller.getCourseById('5').id).toBe('5');
    expect(controller.createCourse(dto).data).toEqual(dto);
    expect(controller.updateCourse('5', { code: 'CS201' }).data).toEqual({
      code: 'CS201',
    });
    expect(controller.patchCourse('5', { credits: 4 }).updatedFields).toEqual([
      'credits',
    ]);
    expect(controller.deleteCourse('5').id).toBe('5');
  });
});
