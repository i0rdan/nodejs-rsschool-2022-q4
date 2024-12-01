import { Injectable, HttpException } from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { Artist } from '../entities/artist.entity';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';
import { ArtistDbService } from './artist.db.service';

@Injectable()
export class ArtistService {
  constructor(private artistDbService: ArtistDbService) {}

  getArtists(): Observable<Artist[]> {
    return this.artistDbService.getArtists();
  }

  getArtist(id: string): Observable<Artist> {
    return this.artistDbService.getArtist(id).pipe(
      map((artist) => {
        if (!artist) {
          throw new HttpException('Artist is not with us', 404);
        }
        return artist;
      }),
    );
  }

  createArtist(data: CreateArtistDto): Observable<Artist> {
    return this.artistDbService.createArtist(data);
  }

  updateArtist(id: string, data: UpdateArtistDto): Observable<Artist> {
    return this.artistDbService.updateArtist(id, data).pipe(
      map((artist) => {
        if (!artist) {
          throw new HttpException('Artist is not with us', 404);
        }
        return artist;
      }),
    );
  }

  deleteArtist(id: string): Observable<void> {
    return this.artistDbService.deleteArtist(id);
  }
}
