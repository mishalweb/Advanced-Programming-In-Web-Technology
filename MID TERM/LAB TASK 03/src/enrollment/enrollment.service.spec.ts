import { Test, TestingModule } from '@nestjs/testing';
import { CourseModule } from '../course/course.module.js';
import { NotificationModule } from '../notification/notification.module.js';
import { EnrollmentModule } from './enrollment.module.js';
import { EnrollmentService } from './enrollment.service.js';

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CourseModule, EnrollmentModule, NotificationModule],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getEnrollments returns all enrollments', () => {
    expect(service.getEnrollments()).toEqual({
      message: 'All enrollments fetched',
      data: [],
    });
  });

  it('enrollStudent uses CourseService and NotificationService', () => {
    expect(service.enrollStudent('John Doe', '101')).toEqual({
      message: 'Student enrolled successfully',
      student: 'John Doe',
      course: { message: 'Course fetched', id: '101' },
      notification: {
        message: 'Notification sent successfully',
        student: 'John Doe',
        notification: 'You have been enrolled in course 101',
      },
    });
  });
});
