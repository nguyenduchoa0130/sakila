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
