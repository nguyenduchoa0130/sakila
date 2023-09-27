import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { Film } from './entities/film.entity';
import { FilmsService } from './films.service';

@Controller('api/films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll() {
    const films = await this.filmsService.findAll();
    return {
      status: 'success',
      data: films,
    };
  }

  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const film = await this.filmsService.findById(id);
    if (!film) {
      return {
        status: 'fail',
        error: {
          code: 404,
          msg: 'Not found actor with ID: ' + id,
        },
      };
    }
    return {
      status: 'success',
      data: film,
    };
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ stopAtFirstError: true }))
    createFilmDto: CreateFilmDto,
  ): Promise<Film> {
    return this.filmsService.create(createFilmDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.filmsService.remove(+id);
  }
}
