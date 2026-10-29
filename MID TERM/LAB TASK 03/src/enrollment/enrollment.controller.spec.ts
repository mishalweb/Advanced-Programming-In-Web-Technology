import { Test, TestingModule } from '@nestjs/testing';
import { CourseModule } from '../course/course.module.js';
import { NotificationModule } from '../notification/notification.module.js';
import { EnrollmentController } from './enrollment.controller.js';
import { EnrollmentModule } from './enrollment.module.js';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CourseModule, EnrollmentModule, NotificationModule],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates every route to EnrollmentService', () => {
    expect(controller.getEnrollments().message).toBe('All enrollments fetched');
    expect(controller.enrollStudent('John Doe', '101').course).toEqual({
      message: 'Course fetched',
      id: '101',
    });
  });
});
