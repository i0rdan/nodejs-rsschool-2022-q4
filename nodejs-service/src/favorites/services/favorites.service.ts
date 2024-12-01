import { Injectable, HttpException } from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { FavoritesResponse } from '../interfaces/favorites-response.interface';
import { FavoritesDbService } from './favorites.db.service';

@Injectable()
export class FavoritesService {
  constructor(private favoritesDbService: FavoritesDbService) {}

  getFavorites(): Observable<FavoritesResponse> {
    return this.favoritesDbService.getFavorites();
  }

  addTrackToFavorites(id: string): Observable<string> {
    return this.favoritesDbService.addTrackToFavorites(id).pipe(
      map((message) => {
        if (!message) {
          throw new HttpException('Track is not with us', 422);
        }
        return message;
      }),
    );
  }

  deleteTrackFromFavorites(id: string): Observable<void> {
    return this.favoritesDbService.deleteTrackFromFavorites(id);
  }

  addAlbumToFavorites(id: string): Observable<string> {
    return this.favoritesDbService.addAlbumToFavorites(id).pipe(
      map((message) => {
        if (!message) {
          throw new HttpException('Album is not with us', 422);
        }
        return message;
      }),
    );
  }

  deleteAlbumFromFavorites(id: string): Observable<void> {
    return this.favoritesDbService.deleteAlbumFromFavorites(id);
  }

  addArtistToFavorites(id: string): Observable<string> {
    return this.favoritesDbService.addArtistToFavorites(id).pipe(
      map((message) => {
        if (!message) {
          throw new HttpException('Artist is not with us', 422);
        }
        return message;
      }),
    );
  }

  deleteArtistFromFavorites(id: string): Observable<void> {
    return this.favoritesDbService.deleteArtistFromFavorites(id);
  }
}
