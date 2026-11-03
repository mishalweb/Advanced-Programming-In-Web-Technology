import { Module } from '@nestjs/common';
import { FacultiesController } from './faculties.controller.js';
import { FacultiesService } from './faculties.service.js';

@Module({
  controllers: [FacultiesController],
  providers: [FacultiesService],
})
export class FacultiesModule {}
