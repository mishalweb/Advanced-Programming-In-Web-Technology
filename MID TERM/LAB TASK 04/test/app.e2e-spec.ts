import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { Products } from '../src/products/entities/products.entity.js';
import { ProductsController } from '../src/products/products.controller.js';
import { ProductsService } from '../src/products/products.service.js';

// Routing and validation tests. The repository is mocked, so no database is needed.
describe('Products API (e2e)', () => {
  let app: INestApplication<App>;
  const repo = {
    create: vi.fn((dto) => ({ ...dto })),
    save: vi.fn(async (product) => ({ id: 1, ...product })),
    find: vi.fn(async () => []),
    findOne: vi.fn(async () => null),
    merge: vi.fn((target, source) => Object.assign(target, source)),
    delete: vi.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Products), useValue: repo },
      ],
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
  });

  it('POST /products creates a product', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'iPhone 15',
        price: 999.99,
        stock: 50,
        category: 'Electronics',
      })
      .expect(201);
    expect(res.body.data.name).toBe('iPhone 15');
  });

  it('POST /products with no body returns all validation errors', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .expect(400);
    expect(res.body.message).toEqual(
      expect.arrayContaining([
        'name should not be empty',
        'price must be a positive number',
        'category should not be empty',
      ]),
    );
  });

  it('POST /products with price -5 fails', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Pen', price: -5, category: 'Stationery' })
      .expect(400);
    expect(res.body.message).toContain('price must be a positive number');
  });

  it('POST /products with an unknown field fails', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Pen', price: 5, category: 'Stationery', color: 'red' })
      .expect(400);
    expect(res.body.message).toContain('property color should not exist');
  });

  it('PUT /products/1 with only price fails', async () => {
    const res = await request(app.getHttpServer())
      .put('/products/1')
      .send({ price: 799.99 })
      .expect(400);
    expect(res.body.message).toEqual(
      expect.arrayContaining([
        'name should not be empty',
        'category should not be empty',
      ]),
    );
  });

  it('PATCH /products/1 with empty name fails', async () => {
    const res = await request(app.getHttpServer())
      .patch('/products/1')
      .send({ name: '' })
      .expect(400);
    expect(res.body.message).toContain('name should not be empty');
  });

  it('GET /products/search is not treated as an id', async () => {
    await request(app.getHttpServer())
      .get('/products/search?keyword=phone')
      .expect(200);
  });

  it('GET /products/999 returns 404', async () => {
    await request(app.getHttpServer()).get('/products/999').expect(404);
  });
});
