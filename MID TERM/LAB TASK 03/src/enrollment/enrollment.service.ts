import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CourseService } from '../course/course.service.js';
import { NotificationService } from '../notification/notification.service.js';

type WrapperType<T> = T;

@Injectable()
export class EnrollmentService {
  constructor(
    private courseService: CourseService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: WrapperType<NotificationService>,
  ) {}

  enrollStudent(studentName: string, courseId: string) {
    const course = this.courseService.getCourseById(courseId);
    const notification = this.notificationService.sendNotification(
      studentName,
      `You have been enrolled in course ${courseId}`,
    );
    return {
      message: 'Student enrolled successfully',
      student: studentName,
      course,
      notification,
    };
  }

  getEnrollments() {
    return { message: 'All enrollments fetched', data: [] };
  }
}
