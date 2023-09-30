import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SakilaErrorResponse } from 'src/shared/models/api-doc.models';
import { CreateFilmDto } from './dto/create-film.dto';
import { Film } from './entities/film.entity';
import {
  FAILED_400_FILM_PAYLOAD,
  SUCCESS_FILM_PAYLOAD,
} from './film-docs.constant';
import { FilmsService } from './films.service';

@Controller('api/films')
@ApiTags('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @ApiOperation({ summary: 'Find all films' })
  @ApiOkResponse({ description: 'Ok', type: Film, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Internal error server',
    type: SakilaErrorResponse,
  })
  @Get()
  async findAll() {
    const films = await this.filmsService.findAll();
    return {
      status: 'success',
      data: films,
    };
  }

  @ApiOperation({ summary: 'Find a film by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The film_id',
    examples: {
      success: { value: 1 },
      failed_400: { value: 'abc' },
      failed_404: { value: 99999 },
    },
  })
  @ApiOkResponse({ description: 'OK', type: Film })
  @ApiBadRequestResponse({
    description: 'Validation errors',
    type: SakilaErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'Not found film',
    type: SakilaErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal error server',
    type: SakilaErrorResponse,
  })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const film = await this.filmsService.findById(id);
    if (!film) {
      throw new NotFoundException('Not found film');
    }
    return {
      status: 'success',
      data: film,
    };
  }

  @ApiOperation({
    summary: 'Create a new film',
    description: `
    # Required:
    - title: a string from 10 to 45 characters
    - description: a string from 10 to 45 characters
    - language_id: a number according to data in language table
    - rental_duration: a number
    - rental_rate: a number
    - replacement_cost: a number
    - rating: a value according to list values: G, FG, PG-13, R, NC-17
    # Optional:
    - release_year: a number
    - original_language_id: a number according to data in language table
    - length: a number
    - special_features: an array according to list values: Trailers, Commentaries, Deleted Scenes, Behind the Scenes
  `,
  })
  @ApiBody({
    type: CreateFilmDto,
    required: true,
    examples: {
      success: {
        value: SUCCESS_FILM_PAYLOAD as Film,
      },
      failed_400: {
        value: FAILED_400_FILM_PAYLOAD as Film,
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created', type: Film })
  @ApiBadRequestResponse({
    description: 'Validation errors',
    type: SakilaErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal error server',
    type: SakilaErrorResponse,
  })
  @Post()
  async create(
    @Body(new ValidationPipe({ stopAtFirstError: true }))
    createFilmDto: CreateFilmDto,
  ) {
    const film = await this.filmsService.create(createFilmDto);
    return {
      status: 'success',
      data: film,
    };
  }

  @ApiOperation({ summary: 'Delete a film by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    examples: {
      success: { value: 10 },
      failed_400: { value: 'abc' },
      failed_404: { value: 99999 },
    },
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  @ApiBadRequestResponse({
    description: 'Validation film',
    type: SakilaErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'Not found film',
    type: SakilaErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal error server',
    type: SakilaErrorResponse,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () =>
          new BadRequestException('The film_id must be a numeric'),
      }),
    )
    id: number,
  ) {
    const film = await this.filmsService.findById(id);
    if (!film) {
      throw new NotFoundException('Not found film');
    }
    await this.filmsService.remove(+id);
  }
}
