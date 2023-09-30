# Week 2 - Validation and API Document

## Validation

#### 1. Install libs

- Firstly, we need to install some libraries to support validation

```bash
npm i --save class-validator class-transformer
```

- **class_validator**: Provide utilities function for validation that is same as **Yup**, **Joi**,...
- **class-transformer**: Transform client's data

#### 2. Create DTO class

- For the purpose of why we should create a DTO class, we need to transform the client's data to specific data before continuing to the next steps

### 3. Validation types

- **Query/Param Validation**: validation parameters in the url
  - NestJS provides Pipes to perform validation:
  - In this guide, I will use **ParseIntPipe** to transform ID in the url and convert to int type
  - [More pipes](https://docs.nestjs.com/pipes)

```ts
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
```

- **Body validation**: validation the client's payload
  - As I mentioned above, we will use the DTO class for this job
  - We define both type and rules for field we wanna handle

```ts
// Create a new actor
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, MaxLength, MinLength } from 'class-validator';

export class CreateActorDto {
  @IsDefined({ message: 'The first name is required' })
  @MinLength(10, {
    message: 'The first name is too short',
  })
  @MaxLength(45, {
    message: 'The first name is too long',
  })
  first_name: string;

  @IsDefined({ message: 'The last name is required' })
  @MinLength(10, {
    message: 'The last name is too short',
  })
  @MaxLength(45, {
    message: 'The last name is too long',
  })
  last_name: string;
}
```

## API Document

### 1. Install libs

```bash
npm install --save @nestjs/swagger
```

### 2. Set up swagger

```ts
// api-docs.config.ts
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const DOC_TITLE = 'The Sakila Project';
const DOC_DESC = 'List sakila endpoints';
const DOC_VERSION = '1.0';

export const configSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder();
  config.setTitle(DOC_TITLE).setDescription(DOC_DESC).setVersion(DOC_VERSION);
  const document = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('docs', app, document); // Define a route for Document UI
};
```

### 3. Binding Nest App

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './configs/api-docs.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configSwagger(app);
  await app.listen(3000);
}
bootstrap();
```

### 4. How to define documents

- Use **@ApiTag(<<group_name>>)**: define a api group like: actors, films
- Use **@ApiOperation**: summarize what that api is doing
- Use **@ApiParam**: define params for API
- Use **@ApiBody**: define body for API
- Use decorators below for describing response:
  - @ApiOkResponse: 200 OK
  - @ApiCreatedResponse: 201 Created
  - @ApiNoContentResponse: 204 No Content
  - [More decorators](https://docs.nestjs.com/openapi/operations)
- Examples:

```ts
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
```
