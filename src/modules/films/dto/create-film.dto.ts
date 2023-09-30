// src/films/dto/create-film.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { FilmRating } from 'src/shared/enums/film-rating.enum';

export class CreateFilmDto {
  @ApiProperty()
  @IsString()
  @MinLength(10, { message: 'Minimum: 10 characters' })
  @MaxLength(45, { message: 'Maximum: 45 characters' })
  readonly title: string;

  @ApiProperty()
  @IsString()
  @MinLength(10, { message: 'Minimum: 10 characters' })
  @MaxLength(45, { message: 'Maximum: 45 characters' })
  readonly description: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly release_year: number;

  @ApiProperty()
  @IsInt()
  readonly language_id: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly original_language_id: number | null;

  @ApiProperty()
  @IsInt()
  readonly rental_duration: number;

  @ApiProperty()
  @IsNumber()
  readonly rental_rate: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  readonly length: number | null;

  @ApiProperty()
  @IsNumber()
  readonly replacement_cost: number;

  @ApiProperty()
  @IsEnum(FilmRating)
  readonly rating: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  readonly special_features: string[] | null;
}
