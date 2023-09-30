# Step 1: Install Nest CLI

```bash
  npm install -g @nestjs/cli
```

# Step 2: Init proj

```bash
  nest new <project_name>
```

# Open your project with your editor, I will use VS Code for this tutorial

```bash
  cd <project_name> && code .
```

# Project structure

- src
  - app.module.ts
  - app.controller.ts
  - app.service.ts

# Connect to database

- Install lib

```bash
npm install --save @nestjs/typeorm typeorm mysql2
```

- Set up database configuration in app module

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsModule } from './modules/actors/actors.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: <your host>,
      port: <your port>,
      username: <your username>,
      password: <your password>,
      database: <your database name>,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

# Implement Actor module

- src
  - modules
    - actors
      - entities
        - actor.entity.ts
      - dtos
        - create-actor.dto.ts
      - actors.controller.ts
      - actors.module.ts
      - actors.service.ts

### 1. Code: actor.entity.ts

```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Actor {
  @PrimaryGeneratedColumn()
  actor_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  last_update: string;
}
```

### 2. Code: create-actor.dto.ts

```ts
import { IsDefined, MaxLength, MinLength } from 'class-validator';

export class CreateActorDto {
  @IsDefined({ message: 'First name is required' })
  @MinLength(3, {
    message: 'First name is too short',
  })
  @MaxLength(45, {
    message: 'First name is too long',
  })
  first_name: string;

  @IsDefined({ message: 'Last name is required' })
  @MinLength(3, {
    message: 'Last name is too short',
  })
  @MaxLength(45, {
    message: 'Last name is too long',
  })
  last_name: string;
}
```

### 3. Code: actors.controller.ts

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dtos/create-actor.dto';

@Controller('api/actors')
export class ActorsController {
  constructor(private actorService: ActorsService) {}

  @Get()
  async fetchAllActors() {
    try {
      const actors = await this.actorService.findAll();
      return {
        status: 'success',
        data: actors,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get(':id')
  async fetchActorById(@Param('id', ParseIntPipe) id: number) {
    try {
      const actor = await this.actorService.findOne(id);
      if (!actor) {
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
        data: actor,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post()
  async createActor(
    @Body(new ValidationPipe({ stopAtFirstError: true }))
    payload: CreateActorDto,
  ) {
    try {
      const newActor = await this.actorService.create(payload);
      return {
        status: 'success',
        data: newActor,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':id')
  async removeActor(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const actor = await this.actorService.findOne(id);
      if (!actor) {
        return res.status(200).json({
          status: 'fail',
          error: {
            code: 404,
            msg: 'Not found actor with ID  = ' + id,
          },
        });
      }
      await this.actorService.remove(id);
      return res.status(204).send();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
```

### 4. Code: actor.service.ts

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';

@Injectable()
export class ActorsService {
  constructor(@InjectRepository(Actor) private actorRepo: Repository<Actor>) {}

  async findAll(): Promise<Actor[]> {
    return this.actorRepo.find();
  }

  async findOne(id: number): Promise<Actor | null> {
    return this.actorRepo.findOneBy({ actor_id: id });
  }

  async remove(id: number): Promise<void> {
    await this.actorRepo.delete(id);
  }

  async create(payload: Partial<Actor>): Promise<Actor> {
    return this.actorRepo.save(payload);
  }
}
```

### 4. Code: actor.module.ts

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActorsController } from './actors.controller';
import { ActorsService } from './actors.service';
import { Actor } from './entities/actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Actor])],
  controllers: [ActorsController],
  providers: [ActorsService],
})
export class ActorsModule {}
```

# Import actor module into app module

```ts
import { ActorsModule } from './modules/actors/actors.module';
....

@Module({
  imports: [
    ....
    ActorsModule,
  ]
})
export class AppModule {}
```

# Start server

```bash
npm start
```
