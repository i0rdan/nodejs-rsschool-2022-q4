import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsString()
  @IsOptional()
  artistId?: string;
}
