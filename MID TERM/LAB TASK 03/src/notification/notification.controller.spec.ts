import { Test, TestingModule } from '@nestjs/testing';
import { CourseModule } from '../course/course.module.js';
import { EnrollmentModule } from '../enrollment/enrollment.module.js';
import { NotificationController } from './notification.controller.js';
import { NotificationModule } from './notification.module.js';

describe('NotificationController', () => {
  let controller: NotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CourseModule, EnrollmentModule, NotificationModule],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates every route to NotificationService', () => {
    expect(
      controller.sendNotification('John Doe', 'Welcome!').notification,
    ).toBe('Welcome!');
    expect(
      controller.checkEnrollmentAndNotify('John Doe', '101').courseId,
    ).toBe('101');
  });
});
