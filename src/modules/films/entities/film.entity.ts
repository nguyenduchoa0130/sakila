import { ApiProperty } from '@nestjs/swagger';
import { FilmRating } from 'src/shared/types/enums/film-rating.enum';
import { SpecialFeature } from 'src/shared/types/enums/special-feature.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('film')
export class Film {
  @ApiProperty()
  @PrimaryGeneratedColumn({ type: 'smallint', unsigned: true })
  film_id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column({ type: 'year', width: 4, nullable: true })
  release_year: number;

  @ApiProperty()
  @Column({ type: 'tinyint', unsigned: true, nullable: false })
  language_id: number;

  @ApiProperty()
  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  original_language_id: number | null;

  @ApiProperty()
  @Column({ type: 'tinyint', unsigned: true, nullable: false, default: 3 })
  rental_duration: number;

  @ApiProperty()
  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: false,
    default: 4.99,
  })
  rental_rate: number;

  @ApiProperty()
  @Column({ type: 'smallint', unsigned: true, nullable: true })
  length: number | null;

  @ApiProperty()
  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    default: 19.99,
  })
  replacement_cost: number;

  @ApiProperty()
  @Column({ type: 'enum', enum: FilmRating, default: 'G' })
  rating: string;

  @ApiProperty()
  @Column({
    type: 'set',
    enum: SpecialFeature,
    nullable: true,
  })
  special_features: string[] | null;

  @ApiProperty()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_update',
  })
  last_update: Date;
}
