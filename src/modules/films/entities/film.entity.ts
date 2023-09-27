import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('film')
export class Film {
  @PrimaryGeneratedColumn({ type: 'smallint', unsigned: true, name: 'film_id' })
  film_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'year', width: 4, nullable: true, name: 'release_year' })
  release_year: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    nullable: false,
    name: 'language_id',
  })
  language_id: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    nullable: true,
    name: 'original_language_id',
  })
  original_language_id: number | null;

  @Column({
    type: 'tinyint',
    unsigned: true,
    nullable: false,
    name: 'rental_duration',
    default: 3,
  })
  rental_duration: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: false,
    name: 'rental_rate',
    default: 4.99,
  })
  rental_rate: number;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  length: number | null;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    name: 'replacement_cost',
    default: 19.99,
  })
  replacement_cost: number;

  @Column({
    type: 'enum',
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
    default: 'G',
  })
  rating: string;

  @Column({
    type: 'set',
    enum: ['Trailers', 'Commentaries', 'Deleted Scenes', 'Behind the Scenes'],
    nullable: true,
    name: 'special_features',
  })
  special_features: string[] | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'last_update',
  })
  last_update: Date;
}
