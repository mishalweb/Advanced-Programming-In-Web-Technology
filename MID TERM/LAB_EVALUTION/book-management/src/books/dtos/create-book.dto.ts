
import { Type } from 'class-transformer';
import {
  IsInt,
  IsString,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  author_name: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  pages: number;
}