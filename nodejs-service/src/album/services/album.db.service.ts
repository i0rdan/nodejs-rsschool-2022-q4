import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Observable, map, from, switchMap, of } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';
import { Album } from '../entities/album.entity';

@Injectable()
export class AlbumDbService {
  constructor(
    @InjectRepository(Album)
    private albumRepo: Repository<Album>,
  ) {}

  getAlbums(): Observable<Album[]> {
    return from(this.albumRepo.find());
  }

  getAlbum(id: string): Observable<Album> {
    return from(this.albumRepo.findOne({ where: { id } })).pipe(
      map((a) => {
        if (!a) {
          return null;
        }
        return a;
      }),
    );
  }

  createAlbum(album: CreateAlbumDto): Observable<Album> {
    const createdAlbum = this.albumRepo.create({
      id: v4(),
      ...album,
    });
    return from(this.albumRepo.save(createdAlbum));
  }

  updateAlbum(id: string, album: UpdateAlbumDto): Observable<Album> {
    return this.getAlbum(id).pipe(
      switchMap((a) => {
        if (!a) {
          return of(null);
        }
        return from(this.albumRepo.save({ ...a, ...album }));
      }),
    );
  }

  deleteAlbum(id: string): Observable<void> {
    return from(this.albumRepo.delete(id)).pipe(
      map(({ affected }) => {
        if (!affected) {
          throw new HttpException('Album is not with us', 404);
        }
      }),
    );
  }
}
