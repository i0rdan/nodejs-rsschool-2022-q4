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

import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumService } from './services/album.service';

@Controller('album')
@UseGuards(AuthGuard('jwt'))
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  getAlbums(): Observable<Album[]> {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  getAlbum(@Param('id', new ParseUUIDPipe()) id: string): Observable<Album> {
    return this.albumService.getAlbum(id);
  }

  @Post()
  createAlbum(
    @Body(new ValidationPipe()) body: CreateAlbumDto,
  ): Observable<Album> {
    return this.albumService.createAlbum(body);
  }

  @Put(':id')
  updateAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) body: UpdateAlbumDto,
  ): Observable<Album> {
    return this.albumService.updateAlbum(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteAlbum(@Param('id', new ParseUUIDPipe()) id: string): Observable<void> {
    return this.albumService.deleteAlbum(id);
  }
}
