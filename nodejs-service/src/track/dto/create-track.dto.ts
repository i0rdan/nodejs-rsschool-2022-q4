import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsOptional()
  albumId?: string;

  @IsString()
  @IsOptional()
  artistId?: string;
}
