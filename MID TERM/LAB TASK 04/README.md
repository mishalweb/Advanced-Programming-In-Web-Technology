# Lab Task 04: Single Entity CRUD with TypeORM & PostgreSQL

Product Inventory API for an e-commerce platform. It stores products in PostgreSQL through TypeORM and supports full CRUD, DTO validation with class-validator, filtering by category and searching by name. There is one entity (`Products`) and no relationships.

## Tech Stack

- Node.js 22
- NestJS 12
- TypeORM + PostgreSQL (`pg`)
- class-validator + class-transformer
- TypeScript 6

## Project Structure

```
ProductInventoryAPI/
├── src/
│   ├── products/
│   │   ├── entities/
│   │   │   └── products.entity.ts
│   │   ├── dto/
│   │   │   ├── create-product.dto.ts
│   │   │   ├── update-product.dto.ts           ← extends CreateProductDto (PUT)
│   │   │   └── partial-update-product.dto.ts   ← PartialType of CreateProductDto (PATCH)
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   └── products.service.ts
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml
├── .gitignore
└── package.json
```

## Setup

1. Start PostgreSQL. Either use Docker:

   ```bash
   docker compose up -d
   ```

   or create the database yourself:

   ```sql
   CREATE DATABASE product_inventory_db;
   ```

   The connection settings are in `src/app.module.ts` (user `postgres`, password `postgres`, port `5432`). Change the password there if yours is different.

2. Install and run:

   ```bash
   npm install
   npm run start:dev
   ```

`synchronize: true` creates the `products` table automatically. It is for development only.

## Product Entity

| Column      | Type    | Decorator / Option                                  |
| ----------- | ------- | --------------------------------------------------- |
| id          | number  | `@PrimaryGeneratedColumn()`                         |
| name        | string  | `@Column()`                                         |
| description | string  | `@Column({ nullable: true })`                       |
| price       | number  | `@Column({ type: 'decimal', precision: 10, scale: 2 })` |
| stock       | number  | `@Column({ default: 0 })`                           |
| category    | string  | `@Column()`                                         |
| isActive    | boolean | `@Column({ default: true })`                        |
| createdAt   | Date    | `@CreateDateColumn()`                               |
| updatedAt   | Date    | `@UpdateDateColumn()`                               |

PostgreSQL returns `decimal` values as strings, so the `price` column has a small transformer that turns them back into numbers.

## API Endpoints

| Method | Route                     | Description                       |
| ------ | ------------------------- | --------------------------------- |
| POST   | /products                 | Create a new product              |
| GET    | /products                 | Get all products (newest first)   |
| GET    | /products/search?keyword= | Search products by name           |
| GET    | /products/category/:cat   | Get all products in a category    |
| GET    | /products/:id             | Get one product by id             |
| PATCH  | /products/:id             | Update a product (partial)        |
| PUT    | /products/:id             | Replace a product (all fields)    |
| DELETE | /products/:id             | Delete a product                  |
| PATCH  | /products/:id/toggle      | Toggle active/inactive status     |

`/products/search` and `/products/category/:cat` are declared before `/products/:id`, so `search` and `category` are never read as ids.

Response shapes:

- Single product: `{ message, data }`
- List: `{ message, count, data: [] }`
- Delete: `{ message, id }`
- Missing product: `404 Product with id X not found`

## Testing

Example requests (same order as the lab sheet):

```bash
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name":"iPhone 15","price":999.99,"stock":50,"category":"Electronics"}'
curl http://localhost:3000/products
curl http://localhost:3000/products/category/Electronics
curl "http://localhost:3000/products/search?keyword=phone"
curl -X PATCH http://localhost:3000/products/1 -H "Content-Type: application/json" -d '{"price":899.99,"stock":45}'
curl -X PUT http://localhost:3000/products/1 -H "Content-Type: application/json" -d '{"name":"iPhone 15 Pro","price":1099.99,"stock":30,"category":"Electronics"}'
curl -X PATCH http://localhost:3000/products/1/toggle
curl -X DELETE http://localhost:3000/products/4
```

Validation examples:

| Request                              | Error                                  |
| ------------------------------------ | -------------------------------------- |
| POST without `name`                  | `name should not be empty`             |
| POST with `price: -5`                | `price must be a positive number`      |
| POST with an unknown field `color`   | `property color should not exist`      |
| PUT with only `price`                | `name` and `category` are required     |
| PATCH with `name: ""`                | `name should not be empty`             |

Automated tests (the repository is mocked, so no database is needed):

```bash
npm test
npm run test:e2e
```
