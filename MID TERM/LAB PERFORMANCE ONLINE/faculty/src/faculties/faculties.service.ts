import { ConflictException, Injectable, OnModuleDestroy } from '@nestjs/common';
import Database from 'better-sqlite3';
import { CreateFacultyDto } from './dto/create-faculty.dto.js';
import { Faculty } from './entities/faculty.entity.js';

@Injectable()
export class FacultiesService implements OnModuleDestroy {
  private readonly database: Database.Database;

  constructor() {
    const databasePath = process.env.FACULTY_DB_PATH ?? 'faculties.db';
    this.database = new Database(databasePath);
    this.database.pragma('journal_mode = WAL');
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS faculties (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        expertise TEXT NOT NULL,
        noOfPublication INTEGER NOT NULL CHECK (noOfPublication >= 0)
      )
    `);
  }

  create(createFacultyDto: CreateFacultyDto): Faculty {
    const insert = this.database.prepare(`
      INSERT INTO faculties (id, name, expertise, noOfPublication)
      VALUES (@id, @name, @expertise, @noOfPublication)
    `);

    try {
      insert.run({
        id: createFacultyDto.id,
        name: createFacultyDto.name,
        expertise: createFacultyDto.expertise,
        noOfPublication: createFacultyDto.noOfPublication,
      });
    } catch (error) {
      if (
        error instanceof Database.SqliteError &&
        error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY'
      ) {
        throw new ConflictException(
          `A faculty with id "${createFacultyDto.id}" already exists`,
        );
      }
      throw error;
    }

    return createFacultyDto;
  }

  onModuleDestroy(): void {
    this.database.close();
  }
}
