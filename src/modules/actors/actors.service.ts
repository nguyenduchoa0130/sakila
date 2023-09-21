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
