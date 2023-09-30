import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { Film } from './entities/film.entity';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmsRepository: Repository<Film>,
  ) {}

  findAll(): Promise<Film[]> {
    return this.filmsRepository.find();
  }

  findById(id: number): Promise<Film> {
    return this.filmsRepository.findOneBy({ film_id: id });
  }

  create(createFilmDto: CreateFilmDto): Promise<Film> {
    const film = this.filmsRepository.create(createFilmDto);
    return this.filmsRepository.save(film);
  }

  remove(id: number): Promise<any> {
    return this.filmsRepository.delete(id);
  }
}
