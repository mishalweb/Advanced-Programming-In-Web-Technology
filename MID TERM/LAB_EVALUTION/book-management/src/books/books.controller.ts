
import { Body, Controller, Post } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dtos/create-book.dto.js';
import { Books } from './entities/books.entity.js';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async createBook(@Body() book: CreateBookDto): Promise<Books> {
    return await this.booksService.createBook(book);
  }
}
