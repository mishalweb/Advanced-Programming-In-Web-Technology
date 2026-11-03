import { Body, Controller, Post } from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto.js';
import { FacultiesService } from './faculties.service.js';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Post('create-faculty')
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultiesService.create(createFacultyDto);
  }
}
