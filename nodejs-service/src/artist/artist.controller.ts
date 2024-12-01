import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  ValidationPipe,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Observable } from 'rxjs';

import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistService } from './services/artist.service';

@Controller('artist')
@UseGuards(AuthGuard('jwt'))
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  getArtists(): Observable<Artist[]> {
    return this.artistService.getArtists();
  }

  @Get(':id')
  getArtist(@Param('id', new ParseUUIDPipe()) id: string): Observable<Artist> {
    return this.artistService.getArtist(id);
  }

  @Post()
  createArtist(
    @Body(new ValidationPipe()) body: CreateArtistDto,
  ): Observable<Artist> {
    return this.artistService.createArtist(body);
  }

  @Put(':id')
  updateArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) body: UpdateArtistDto,
  ): Observable<Artist> {
    return this.artistService.updateArtist(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteArtist(@Param('id', new ParseUUIDPipe()) id: string): Observable<void> {
    return this.artistService.deleteArtist(id);
  }
}
