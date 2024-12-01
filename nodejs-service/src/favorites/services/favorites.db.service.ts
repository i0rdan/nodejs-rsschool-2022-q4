import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Observable,
  map,
  from,
  switchMap,
  of,
  combineLatest,
  forkJoin,
  catchError,
} from 'rxjs';
import { Repository } from 'typeorm';

import { AlbumService } from 'src/album/services/album.service';
import { ArtistService } from 'src/artist/services/artist.service';
import { TrackService } from 'src/track/services/track.service';

import { Favorites } from '../entities/favorites.entity';
import { FavoritesResponse } from '../interfaces/favorites-response.interface';

@Injectable()
export class FavoritesDbService {
  constructor(
    @InjectRepository(Favorites)
    private favsRepo: Repository<Favorites>,
    private artistService: ArtistService,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}

  // get inintial favorites
  getCurrFavorites(): Observable<Favorites> {
    return from(this.favsRepo.find()).pipe(
      switchMap(([fav]) => {
        if (fav) {
          return of(fav);
        }

        const createdFavs = this.favsRepo.create({
          artists: [],
          albums: [],
          tracks: [],
        });
        return from(this.favsRepo.save(createdFavs));
      }),
    );
  }

  getFavorites(): Observable<FavoritesResponse> {
    return this.getCurrFavorites().pipe(
      switchMap(({ artists, albums, tracks }) => {
        const artists$ = !artists.length
          ? of([])
          : forkJoin([
              ...artists.map((id) =>
                this.artistService
                  .getArtist(id)
                  .pipe(catchError(() => of(null))),
              ),
            ]).pipe(map((a) => a.filter((artist) => Boolean(artist))));
        const albums$ = !albums.length
          ? of([])
          : forkJoin([
              ...albums.map((id) =>
                this.albumService.getAlbum(id).pipe(catchError(() => of(null))),
              ),
            ]).pipe(map((a) => a.filter((album) => Boolean(album))));
        const tracks$ = !tracks.length
          ? of([])
          : forkJoin([
              ...tracks.map((id) =>
                this.trackService.getTrack(id).pipe(catchError(() => of(null))),
              ),
            ]).pipe(map((t) => t.filter((track) => Boolean(track))));

        return combineLatest([artists$, albums$, tracks$]).pipe(
          map(([artists, albums, tracks]) => ({
            albums,
            tracks,
            artists,
          })),
        );
      }),
    );
  }

  addTrackToFavorites(id: string): Observable<string> {
    return this.trackService.getTrack(id).pipe(
      catchError(() => of(null)),
      switchMap((track) => {
        if (!track) {
          return of(null);
        }
        return this.getCurrFavorites().pipe(
          switchMap((fav) => {
            if (!fav.tracks.includes(id)) {
              fav.tracks.push(id);
            }
            return from(this.favsRepo.save(fav)).pipe(
              map(() => 'Track was added'),
            );
          }),
        );
      }),
    );
  }

  deleteTrackFromFavorites(id: string): Observable<void> {
    return combineLatest([
      this.getCurrFavorites(),
      this.trackService.getTrack(id),
    ]).pipe(
      switchMap(([fav, track]) => {
        const trackInFavsIndex = fav.tracks.indexOf(id);
        if (trackInFavsIndex === -1 || !track) {
          throw new HttpException('Track is not favorite, or not with us', 404);
        }

        fav.tracks.splice(trackInFavsIndex, 1);

        return from(this.favsRepo.save(fav)).pipe(
          map(() => {
            console.log('track deleted');
          }),
        );
      }),
    );
  }

  addAlbumToFavorites(id: string): Observable<string> {
    return this.albumService.getAlbum(id).pipe(
      catchError(() => of(null)),
      switchMap((album) => {
        if (!album) {
          return of(null);
        }
        return this.getCurrFavorites().pipe(
          switchMap((fav) => {
            if (!fav.albums.includes(id)) {
              fav.albums.push(id);
            }
            return from(this.favsRepo.save(fav)).pipe(
              map(() => 'Album was added'),
            );
          }),
        );
      }),
    );
  }

  deleteAlbumFromFavorites(id: string): Observable<void> {
    return combineLatest([
      this.getCurrFavorites(),
      this.albumService.getAlbum(id),
    ]).pipe(
      switchMap(([fav, album]) => {
        const albumInFavsIndex = fav.albums.indexOf(id);
        if (albumInFavsIndex === -1 || !album) {
          throw new HttpException('Album is not favorite, or not with us', 404);
        }

        fav.albums.splice(albumInFavsIndex, 1);

        return from(this.favsRepo.save(fav)).pipe(
          map(() => {
            console.log('album deleted');
          }),
        );
      }),
    );
  }

  addArtistToFavorites(id: string): Observable<string> {
    return this.artistService.getArtist(id).pipe(
      catchError(() => of(null)),
      switchMap((artist) => {
        if (!artist) {
          return of(null);
        }
        return this.getCurrFavorites().pipe(
          switchMap((fav) => {
            if (!fav.artists.includes(id)) {
              fav.artists.push(id);
            }
            return from(this.favsRepo.save(fav)).pipe(
              map(() => 'Artist was added'),
            );
          }),
        );
      }),
    );
  }

  deleteArtistFromFavorites(id: string): Observable<void> {
    return combineLatest([
      this.getCurrFavorites(),
      this.artistService.getArtist(id),
    ]).pipe(
      switchMap(([fav, artist]) => {
        const artistInFavsIndex = fav.artists.indexOf(id);
        if (artistInFavsIndex === -1 || !artist) {
          throw new HttpException(
            'Artist is not favorite, or not with us',
            404,
          );
        }

        fav.artists.splice(artistInFavsIndex, 1);

        return from(this.favsRepo.save(fav)).pipe(
          map(() => {
            console.log('artist deleted');
          }),
        );
      }),
    );
  }
}
