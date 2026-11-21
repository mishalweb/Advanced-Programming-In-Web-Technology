
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Books } from './entities/books.entity.js';
import { CreateBookDto } from './dtos/create-book.dto.js';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books)
    private readonly booksRepo: Repository<Books>,
  ) {}

  async createBook(book: CreateBookDto): Promise<Books> {
    const existingBook = await this.booksRepo.findOneBy({
      id: book.id,
    });

    if (existingBook) {
      throw new ConflictException('Book ID already exists');
    }

    try {
      const bookEntity = this.booksRepo.create(book);
      return await this.booksRepo.save(bookEntity);
    } catch {
      throw new BadRequestException('Failed to create book');
    }
  }
}
