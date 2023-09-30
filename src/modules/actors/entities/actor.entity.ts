import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Actor {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  actor_id: number;

  @ApiProperty()
  @Column()
  first_name: string;

  @ApiProperty()
  @Column()
  last_name: string;

  @ApiProperty()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  last_update: string;
}
