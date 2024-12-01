import { Injectable, HttpException } from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { AlbumDbService } from './album.db.service';

@Injectable()
export class AlbumService {
  constructor(private albumDbService: AlbumDbService) {}

  getAlbums(): Observable<Album[]> {
    return this.albumDbService.getAlbums();
  }

  getAlbum(id: string): Observable<Album> {
    return this.albumDbService.getAlbum(id).pipe(
      map((album) => {
        if (!album) {
          throw new HttpException('Album is not with us', 404);
        }
        return album;
      }),
    );
  }

  createAlbum(data: CreateAlbumDto): Observable<Album> {
    return this.albumDbService.createAlbum(data);
  }

  updateAlbum(id: string, data: UpdateAlbumDto): Observable<Album> {
    return this.albumDbService.updateAlbum(id, data).pipe(
      map((album) => {
        if (!album) {
          throw new HttpException('Album is not with us', 404);
        }
        return album;
      }),
    );
  }

  deleteAlbum(id: string): Observable<void> {
    return this.albumDbService.deleteAlbum(id);
  }
}
