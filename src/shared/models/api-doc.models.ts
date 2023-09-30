import { ApiProperty } from '@nestjs/swagger';

export class SakilaErrorResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
