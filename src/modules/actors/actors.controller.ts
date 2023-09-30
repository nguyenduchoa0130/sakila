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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SakilaErrorResponse } from 'src/shared/models/api-doc.models';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dtos/create-actor.dto';
import { Actor } from './entities/actor.entity';

@Controller('api/actors')
@ApiTags('actors')
export class ActorsController {
  constructor(private actorService: ActorsService) {}

  @ApiOperation({ summary: 'Find all actors' })
  @ApiOkResponse({ description: 'OK', type: Actor, isArray: true })
  @ApiInternalServerErrorResponse({
    description: 'Internal error server',
    type: SakilaErrorResponse,
  })
  @Get()
  async fetchAllActors() {
    const actors = await this.actorService.findAll();
    return {
      status: 'success',
      data: actors,
    };
  }

  @ApiOperation({ summary: 'Find actor by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The actor_id',
    examples: {
      success: {
        value: 15,
      },
      failed_400: {
        value: 'abc',
      },
      failed_404: {
        value: 999999,
      },
    },
  })
  @ApiOkResponse({ description: 'OK', type: Actor })
  @ApiBadRequestResponse({
    description: 'Validation errors',
    type: SakilaErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'Not found actor',
    type: SakilaErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal error server',
    type: SakilaErrorResponse,
  })
  @Get(':id')
  async fetchActorById(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () =>
          new BadRequestException('The actor_id must be a numeric'),
      }),
    )
    id: number,
  ) {
    const actor = await this.actorService.findOne(id);
    if (!actor) {
      throw new NotFoundException('Not found actor');
    }
    return {
      status: 'success',
      data: actor,
    };
  }

  @ApiOperation({
    summary: 'Create a new actor',
    description: `
    - Must provide the first_name field with length from 10 to 45 characters
    - Must provide the last_name field with length from 10 to 45 characters
  `,
  })
  @ApiBody({
    type: Actor,
    required: true,
    examples: {
      success: {
        value: { first_name: 'Nguyen Duc', last_name: 'Hoa 21424019' } as Actor,
      },
      failed_400: {
        value: { first_name: 'Nguyen', last_name: 'Hoa' } as Actor,
      },
    },
  })
  @ApiCreatedResponse({ description: 'Created', type: Actor })
  @ApiBadRequestResponse({
    description: 'Validation errors',
    type: SakilaErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal error server',
    type: SakilaErrorResponse,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createActor(
    @Body(new ValidationPipe({ stopAtFirstError: true }))
    payload: CreateActorDto,
  ) {
    const newActor = await this.actorService.create(payload);
    return {
      status: 'success',
      data: newActor,
    };
  }

  @ApiOperation({ summary: 'Remove an actor by ID' })
  @ApiParam({
    name: 'id',
    type: 'number',
    examples: {
      success: {
        value: 1,
      },
      failed_400: {
        value: 'abc',
      },
      failed_404: {
        value: '99999999',
      },
    },
  })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Validation errors',
    type: SakilaErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'Not found actor',
    type: SakilaErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal error server',
    type: SakilaErrorResponse,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeActor(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory: () =>
          new BadRequestException('The actor_id must be a numeric'),
      }),
    )
    id: number,
  ) {
    const actor = await this.actorService.findOne(id);
    if (!actor) {
      throw new NotFoundException('Not found actor');
    }
    await this.actorService.remove(id);
  }
}
