import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { existsSync, rmSync } from 'node:fs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('CourseManagementAPI (e2e)', () => {
  let app: INestApplication<App>;
  const uploadedPaths: string[] = [];
  const validCourse = {
    name: 'NestJS Fundamentals',
    code: 'CS101',
    instructor: 'John Doe',
    credits: 3,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    for (const path of uploadedPaths) {
      rmSync(path, { force: true });
    }
  });

  describe('valid requests', () => {
    it('POST /course', () => {
      return request(app.getHttpServer())
        .post('/course')
        .send(validCourse)
        .expect(201)
        .expect({ message: 'Course created successfully', data: validCourse });
    });

    it('GET /course', () => {
      return request(app.getHttpServer())
        .get('/course')
        .expect(200)
        .expect({ message: 'All courses fetched successfully', data: [] });
    });

    it('GET /course/5', () => {
      return request(app.getHttpServer())
        .get('/course/5')
        .expect(200)
        .expect({ message: 'Course fetched successfully', id: '5' });
    });

    it('PUT /course/5', () => {
      return request(app.getHttpServer())
        .put('/course/5')
        .send({ name: 'NestJS Advanced', code: 'CS201' })
        .expect(200)
        .expect({
          message: 'Course updated successfully',
          id: '5',
          data: { name: 'NestJS Advanced', code: 'CS201' },
        });
    });

    it('PATCH /course/5', () => {
      return request(app.getHttpServer())
        .patch('/course/5')
        .send({ name: 'NestJS', credits: 4 })
        .expect(200)
        .expect({
          message: 'Course patched successfully',
          id: '5',
          updatedFields: ['name', 'credits'],
        });
    });

    it('DELETE /course/5', () => {
      return request(app.getHttpServer())
        .delete('/course/5')
        .expect(200)
        .expect({ message: 'Course deleted successfully', id: '5' });
    });

    it('POST /course/5/upload with a .pdf file', async () => {
      const response = await request(app.getHttpServer())
        .post('/course/5/upload')
        .attach('file', Buffer.from('%PDF-1.4'), 'notes.pdf')
        .expect(201);

      uploadedPaths.push(response.body.path);
      expect(response.body.message).toBe('Material uploaded successfully');
      expect(response.body.courseId).toBe('5');
      expect(response.body.filename).toMatch(/^\d+-notes\.pdf$/);
      expect(response.body.path).toBe(`uploads/${response.body.filename}`);
      expect(existsSync(response.body.path)).toBe(true);
    });

    it('POST /course/5/upload with a .jpg file', async () => {
      const response = await request(app.getHttpServer())
        .post('/course/5/upload')
        .attach('file', Buffer.from('jpg'), 'photo.jpg')
        .expect(201);

      uploadedPaths.push(response.body.path);
      expect(response.body.filename).toMatch(/^\d+-photo\.jpg$/);
    });

    it('converts a numeric string to a number for credits', () => {
      return request(app.getHttpServer())
        .post('/course')
        .send({ ...validCourse, credits: '3' })
        .expect(201)
        .expect({ message: 'Course created successfully', data: validCourse });
    });
  });

  describe('invalid requests', () => {
    it('rejects an empty name', async () => {
      const response = await request(app.getHttpServer())
        .post('/course')
        .send({ ...validCourse, name: '' })
        .expect(400);

      expect(response.body.message).toContain('name should not be empty');
    });

    it('rejects credits greater than 6', async () => {
      const response = await request(app.getHttpServer())
        .post('/course')
        .send({ ...validCourse, credits: 10 })
        .expect(400);

      expect(response.body.message).toContain(
        'credits must not be greater than 6',
      );
    });

    it('lists all missing required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/course')
        .send({})
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'name should not be empty',
          'code should not be empty',
          'instructor should not be empty',
          'credits must be a number conforming to the specified constraints',
        ]),
      );
    });

    it('rejects unknown fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/course')
        .send({ ...validCourse, room: '101' })
        .expect(400);

      expect(response.body.message).toContain('property room should not exist');
    });

    it('rejects an invalid partial body on PATCH', async () => {
      const response = await request(app.getHttpServer())
        .patch('/course/5')
        .send({ credits: 0 })
        .expect(400);

      expect(response.body.message).toContain(
        'credits must not be less than 1',
      );
    });

    it('rejects a .txt file', async () => {
      const response = await request(app.getHttpServer())
        .post('/course/5/upload')
        .attach('file', Buffer.from('hello'), 'notes.txt')
        .expect(400);

      expect(response.body.message).toBe(
        'Only .jpg, .jpeg, .png and .pdf files are allowed',
      );
    });

    it('rejects a .exe file', () => {
      return request(app.getHttpServer())
        .post('/course/5/upload')
        .attach('file', Buffer.from('MZ'), 'tool.exe')
        .expect(400);
    });

    it('rejects a file larger than 2MB', async () => {
      const response = await request(app.getHttpServer())
        .post('/course/5/upload')
        .attach('file', Buffer.alloc(2 * 1024 * 1024 + 1), 'big.pdf')
        .expect(413);

      expect(response.body.message).toBe('File too large');
    });

    it('rejects an upload without a file', () => {
      return request(app.getHttpServer()).post('/course/5/upload').expect(400);
    });
  });
});
