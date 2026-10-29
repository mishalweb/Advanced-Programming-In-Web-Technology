# Lab Task 03: Dependency Injection in NestJS

University System API that demonstrates the three types of Dependency Injection in NestJS: Intra-Module, Inter-Module and Circular. This is a standalone project with three modules: CourseModule, EnrollmentModule and NotificationModule.

## Tech Stack

- Node.js 22
- NestJS 12
- TypeScript 6
- npm

## Project Structure

```
UniversitySystemAPI/
├── src/
│   ├── course/
│   │   ├── course.module.ts
│   │   ├── course.controller.ts
│   │   └── course.service.ts
│   ├── enrollment/
│   │   ├── enrollment.module.ts
│   │   ├── enrollment.controller.ts
│   │   └── enrollment.service.ts
│   ├── notification/
│   │   ├── notification.module.ts
│   │   ├── notification.controller.ts
│   │   └── notification.service.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
└── nest-cli.json
```

## Setup

```bash
npm install
npm run start:dev
```

## Dependency Injection Summary

| Part   | DI Type      | Dependency                              | Key Mechanism              |
| ------ | ------------ | --------------------------------------- | -------------------------- |
| Part A | Intra-Module | CourseController → CourseService        | providers[]                |
| Part B | Inter-Module | EnrollmentService → CourseService       | exports[] + imports[]      |
| Part C | Circular     | EnrollmentService ↔ NotificationService | forwardRef() on both sides |

## Circular Dependency and ES Modules

NestJS 12 projects use ES modules. With ES modules, a class that is part of an import cycle is not initialized yet when TypeScript writes its constructor type metadata, so the app crashes with `Cannot access 'NotificationService' before initialization`. Following the NestJS documentation, both circular services use a `WrapperType<T>` type together with `@Inject(forwardRef(() => ...))`:

```ts
type WrapperType<T> = T;

constructor(
  private courseService: CourseService,
  @Inject(forwardRef(() => NotificationService))
  private notificationService: WrapperType<NotificationService>,
) {}
```

Both modules also use `forwardRef()` in their `imports` array.

## API Endpoints

| Method | Route               | Body                                                   |
| ------ | ------------------- | ------------------------------------------------------ |
| GET    | /course             |                                                        |
| GET    | /course/:id         |                                                        |
| POST   | /course             | `{ "name": "NestJS", "code": "CS301" }`                |
| GET    | /enrollment         |                                                        |
| POST   | /enrollment         | `{ "studentName": "John Doe", "courseId": "101" }`     |
| POST   | /notification/send  | `{ "studentName": "John Doe", "message": "Welcome!" }` |
| POST   | /notification/check | `{ "studentName": "John Doe", "courseId": "101" }`     |

Example response from `POST /enrollment`:

```json
{
  "message": "Student enrolled successfully",
  "student": "John Doe",
  "course": { "message": "Course fetched", "id": "101" },
  "notification": {
    "message": "Notification sent successfully",
    "student": "John Doe",
    "notification": "You have been enrolled in course 101"
  }
}
```

## Testing

```bash
curl http://localhost:3000/course/101
curl -X POST http://localhost:3000/enrollment -H "Content-Type: application/json" -d '{"studentName":"John Doe","courseId":"101"}'
curl -X POST http://localhost:3000/notification/check -H "Content-Type: application/json" -d '{"studentName":"John Doe","courseId":"101"}'
```

Automated tests:

```bash
npm test
npm run test:e2e
```
