import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  albumId?: string;

  @IsString()
  @IsOptional()
  artistId?: string;
}
