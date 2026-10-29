import { Test, TestingModule } from '@nestjs/testing';
import { CourseModule } from '../course/course.module.js';
import { EnrollmentModule } from '../enrollment/enrollment.module.js';
import { NotificationModule } from './notification.module.js';
import { NotificationService } from './notification.service.js';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CourseModule, EnrollmentModule, NotificationModule],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sendNotification returns the notification', () => {
    expect(service.sendNotification('John Doe', 'Welcome!')).toEqual({
      message: 'Notification sent successfully',
      student: 'John Doe',
      notification: 'Welcome!',
    });
  });

  it('checkEnrollmentAndNotify uses EnrollmentService', () => {
    const result = service.checkEnrollmentAndNotify('John Doe', '101');
    expect(result.enrollments).toEqual({
      message: 'All enrollments fetched',
      data: [],
    });
    expect(result.student).toBe('John Doe');
    expect(result.courseId).toBe('101');
  });
});
