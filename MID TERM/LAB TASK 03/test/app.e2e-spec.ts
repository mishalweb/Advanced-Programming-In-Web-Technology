import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('UniversitySystemAPI (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Part A - Intra-Module (CourseModule)', () => {
    it('GET /course', () => {
      return request(app.getHttpServer())
        .get('/course')
        .expect(200)
        .expect({ message: 'All courses fetched', data: [] });
    });

    it('GET /course/101', () => {
      return request(app.getHttpServer())
        .get('/course/101')
        .expect(200)
        .expect({ message: 'Course fetched', id: '101' });
    });

    it('POST /course', () => {
      return request(app.getHttpServer())
        .post('/course')
        .send({ name: 'NestJS', code: 'CS301' })
        .expect(201)
        .expect({
          message: 'Course created',
          data: { name: 'NestJS', code: 'CS301' },
        });
    });
  });

  describe('Part B - Inter-Module (EnrollmentModule uses CourseModule)', () => {
    it('GET /enrollment', () => {
      return request(app.getHttpServer())
        .get('/enrollment')
        .expect(200)
        .expect({ message: 'All enrollments fetched', data: [] });
    });

    it('POST /enrollment includes data from CourseService', async () => {
      const response = await request(app.getHttpServer())
        .post('/enrollment')
        .send({ studentName: 'John Doe', courseId: '101' })
        .expect(201);

      expect(response.body.message).toBe('Student enrolled successfully');
      expect(response.body.student).toBe('John Doe');
      expect(response.body.course).toEqual({
        message: 'Course fetched',
        id: '101',
      });
    });
  });

  describe('Part C - Circular Dependency (Enrollment + Notification)', () => {
    it('POST /notification/send', () => {
      return request(app.getHttpServer())
        .post('/notification/send')
        .send({ studentName: 'John Doe', message: 'Welcome!' })
        .expect(201)
        .expect({
          message: 'Notification sent successfully',
          student: 'John Doe',
          notification: 'Welcome!',
        });
    });

    it('POST /notification/check calls EnrollmentService', async () => {
      const response = await request(app.getHttpServer())
        .post('/notification/check')
        .send({ studentName: 'John Doe', courseId: '101' })
        .expect(201);

      expect(response.body.student).toBe('John Doe');
      expect(response.body.courseId).toBe('101');
      expect(response.body.enrollments).toEqual({
        message: 'All enrollments fetched',
        data: [],
      });
    });

    it('POST /enrollment includes a notification confirmation', async () => {
      const response = await request(app.getHttpServer())
        .post('/enrollment')
        .send({ studentName: 'John Doe', courseId: '101' })
        .expect(201);

      expect(response.body.notification).toEqual({
        message: 'Notification sent successfully',
        student: 'John Doe',
        notification: 'You have been enrolled in course 101',
      });
    });
  });
});
