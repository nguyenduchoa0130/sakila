import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, MaxLength, MinLength } from 'class-validator';

export class CreateActorDto {
  @ApiProperty()
  @IsDefined({ message: 'The first name is required' })
  @MinLength(10, {
    message: 'The first name is too short',
  })
  @MaxLength(45, {
    message: 'The first name is too long',
  })
  first_name: string;

  @ApiProperty()
  @IsDefined({ message: 'The last name is required' })
  @MinLength(10, {
    message: 'The last name is too short',
  })
  @MaxLength(45, {
    message: 'The last name is too long',
  })
  last_name: string;
}
