import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Observable, map, from, switchMap, of } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { Artist } from '../entities/artist.entity';

@Injectable()
export class ArtistDbService {
  constructor(
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,
  ) {}

  getArtists(): Observable<Artist[]> {
    return from(this.artistRepo.find());
  }

  getArtist(id: string): Observable<Artist> {
    return from(this.artistRepo.findOne({ where: { id } }));
  }

  createArtist(artist: CreateArtistDto): Observable<Artist> {
    const createdArtist = this.artistRepo.create({
      id: v4(),
      ...artist,
    });
    return from(this.artistRepo.save(createdArtist));
  }

  updateArtist(id: string, artist: UpdateArtistDto): Observable<Artist> {
    return this.getArtist(id).pipe(
      switchMap((a) => {
        if (!a) {
          return of(null);
        }
        return from(this.artistRepo.save({ ...a, ...artist }));
      }),
    );
  }

  deleteArtist(id: string): Observable<void> {
    return from(this.artistRepo.delete(id)).pipe(
      map(({ affected }) => {
        if (!affected) {
          throw new HttpException('Artist is not with us', 404);
        }
      }),
    );
  }
}
