import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { EnrollmentService } from '../enrollment/enrollment.service.js';

type WrapperType<T> = T;

@Injectable()
export class NotificationService {
  constructor(
    @Inject(forwardRef(() => EnrollmentService))
    private enrollmentService: WrapperType<EnrollmentService>,
  ) {}

  sendNotification(studentName: string, message: string) {
    return {
      message: 'Notification sent successfully',
      student: studentName,
      notification: message,
    };
  }

  checkEnrollmentAndNotify(studentName: string, courseId: string) {
    const enrollments = this.enrollmentService.getEnrollments();
    return {
      message: 'Enrollment checked and notification sent',
      student: studentName,
      courseId,
      enrollments,
      notification: this.sendNotification(
        studentName,
        `Enrollment status checked for course ${courseId}`,
      ),
    };
  }
}
