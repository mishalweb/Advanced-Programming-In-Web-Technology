import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FacultiesModule } from './faculties/faculties.module.js';

@Module({
  imports: [FacultiesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
