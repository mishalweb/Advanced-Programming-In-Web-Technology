# Lab Task 02: Course Management REST API (NestJS)

Input Validation, DTOs, Pipes and File Upload. This project extends Lab Task 01 with DTO validation through a global `ValidationPipe`, structured JSON responses from the Service layer, and a file upload route for course materials.

## Tech Stack

- Node.js 22
- NestJS 12
- TypeScript 6
- class-validator, class-transformer, @nestjs/mapped-types
- multer

## Project Structure

```
CourseManagementAPI/
├── src/
│   ├── course/
│   │   ├── dto/
│   │   │   ├── create-course.dto.ts
│   │   │   └── update-course.dto.ts
│   │   ├── course.module.ts
│   │   ├── course.controller.ts
│   │   └── course.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── uploads/              generated at runtime
├── package.json
└── nest-cli.json
```

## Setup

```bash
npm install
npm run start:dev
```

## Validation Rules (CreateCourseDto)

| Field       | Type   | Required | Rules                       |
| ----------- | ------ | -------- | --------------------------- |
| name        | string | Yes      | Cannot be empty             |
| code        | string | Yes      | Course code, e.g. CS101     |
| instructor  | string | Yes      | Cannot be empty             |
| credits     | number | Yes      | Between 1 and 6             |
| description | string | No       | Optional course description |

`UpdateCourseDto` extends `PartialType(CreateCourseDto)`, so every field is optional but keeps its rules.

## API Endpoints

| Method | Route              | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | /course            | Get all courses         |
| GET    | /course/:id        | Get course by ID        |
| POST   | /course            | Create new course       |
| PUT    | /course/:id        | Update course (full)    |
| PATCH  | /course/:id        | Update course (partial) |
| DELETE | /course/:id        | Delete course           |
| POST   | /course/:id/upload | Upload course material  |

The upload route expects form-data with a field named `file`. Only `.jpg`, `.jpeg`, `.png` and `.pdf` files up to 2MB are accepted. Files are saved in `uploads/`.

## Example Responses

```json
{ "message": "Course created successfully", "data": { "name": "NestJS Fundamentals", "code": "CS101", "instructor": "John Doe", "credits": 3 } }
{ "message": "Course patched successfully", "id": "5", "updatedFields": ["name", "credits"] }
{ "message": "Material uploaded successfully", "courseId": "5", "filename": "1234567890-notes.pdf", "path": "uploads/1234567890-notes.pdf" }
```

Validation error:

```json
{
  "statusCode": 400,
  "message": ["name should not be empty", "credits must not be greater than 6"],
  "error": "Bad Request"
}
```

## Testing

```bash
curl -X POST http://localhost:3000/course -H "Content-Type: application/json" -d '{"name":"NestJS Fundamentals","code":"CS101","instructor":"John Doe","credits":3}'
curl -X PATCH http://localhost:3000/course/5 -H "Content-Type: application/json" -d '{"name":"NestJS","credits":4}'
curl -X POST http://localhost:3000/course/5/upload -F "file=@notes.pdf"
```

Automated tests cover every valid and invalid scenario from the lab sheet:

```bash
npm test
npm run test:e2e
```
