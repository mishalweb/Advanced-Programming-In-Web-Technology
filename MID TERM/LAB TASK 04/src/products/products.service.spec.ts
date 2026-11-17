import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Products } from './entities/products.entity.js';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  let service: ProductsService;
  const repo = {
    create: vi.fn((dto) => ({ ...dto })),
    save: vi.fn(async (product) => ({ id: 1, ...product })),
    find: vi.fn(),
    findOne: vi.fn(),
    merge: vi.fn((target, source) => Object.assign(target, source)),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Products), useValue: repo },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('create() saves the product', async () => {
    const dto = { name: 'iPhone 15', price: 999.99, category: 'Electronics' };
    const result = await service.create(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result.data).toMatchObject({ id: 1, ...dto });
  });

  it('findAll() returns newest first with a count', async () => {
    repo.find.mockResolvedValue([{ id: 2 }, { id: 1 }]);
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ order: { createdAt: 'DESC' } });
    expect(result.count).toBe(2);
  });

  it('findOne() throws 404 when the product does not exist', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('update() changes only the sent fields', async () => {
    repo.findOne.mockResolvedValue({ id: 1, name: 'iPhone 15', price: 999.99 });
    const result = await service.update(1, { price: 899.99 });
    expect(result.data).toMatchObject({ name: 'iPhone 15', price: 899.99 });
  });

  it('replace() resets optional fields that are not sent', async () => {
    repo.findOne.mockResolvedValue({
      id: 1,
      description: 'old',
      stock: 50,
      isActive: false,
    });
    // ValidationPipe gives the service a DTO whose missing fields are undefined
    const result = await service.replace(1, {
      name: 'iPhone 15 Pro',
      description: undefined,
      price: 1099.99,
      stock: undefined,
      category: 'Electronics',
      isActive: undefined,
    });
    expect(result.data).toMatchObject({
      name: 'iPhone 15 Pro',
      description: null,
      stock: 0,
      isActive: true,
    });
  });

  it('remove() deletes and returns the id', async () => {
    repo.findOne.mockResolvedValue({ id: 4 });
    const result = await service.remove(4);
    expect(repo.delete).toHaveBeenCalledWith(4);
    expect(result).toEqual({ message: 'Product deleted successfully', id: 4 });
  });

  it('remove() throws 404 when the product does not exist', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.remove(4)).rejects.toThrow(NotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('toggleActive() flips isActive', async () => {
    repo.findOne.mockResolvedValue({ id: 1, isActive: true });
    const result = await service.toggleActive(1);
    expect(result.data.isActive).toBe(false);
  });
});
