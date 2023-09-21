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
