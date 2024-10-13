import { IsNotEmpty, IsString } from 'class-validator';

export class InsertExampleDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
