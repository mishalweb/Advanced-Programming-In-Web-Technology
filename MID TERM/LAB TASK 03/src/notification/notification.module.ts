import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentModule } from '../enrollment/enrollment.module.js';
import { NotificationController } from './notification.controller.js';
import { NotificationService } from './notification.service.js';

@Module({
  imports: [forwardRef(() => EnrollmentModule)],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
