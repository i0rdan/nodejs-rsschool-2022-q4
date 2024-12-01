import { Injectable, HttpException } from '@nestjs/common';

import { Observable, map, of } from 'rxjs';

import { v4 } from 'uuid';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/user/dto/update-password.dto';
import { UserWithoutPassword } from 'src/user/interfaces/user-without-password.interface';

import { Track } from 'src/track/interfaces/track.interface';
import { CreateTrackDto } from 'src/track/dto/create-track.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';

import { Artist } from 'src/artist/interfaces/artist.interface';
import { CreateArtistDto } from 'src/artist/dto/create-artist.dto';
import { UpdateArtistDto } from 'src/artist/dto/update-artist.dto';

import { Album } from 'src/album/interfaces/album.interface';
import { CreateAlbumDto } from 'src/album/dto/create-album.dto';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';

import { FavoritesResponse } from 'src/favorites/interfaces/favorites-response.interface';

import { StoreInterface } from '../interfaces/store.interface';

@Injectable()
export class StoreService {
  private storeData$: Observable<StoreInterface> = of({
    favorites: {
      albums: [],
      tracks: [],
      artists: [],
    },
    users: {},
    tracks: {},
    albums: {},
    artists: {},
  });

  getUsers(): Observable<UserWithoutPassword[]> {
    return this.storeData$.pipe(
      map(({ users }) =>
        Object.values(users).map(({ password, ...user }) => user),
      ),
    );
  }

  getUser(id: string): Observable<UserWithoutPassword> {
    return this.storeData$.pipe(
      map(({ users }) => {
        const { password, ...user } = users[id] || {};
        return user as UserWithoutPassword;
      }),
    );
  }

  createUser({
    login,
    password,
  }: CreateUserDto): Observable<UserWithoutPassword> {
    const id = v4();
    const createdUserWithoutPassword: UserWithoutPassword = {
      id,
      login,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return this.storeData$.pipe(
      map((store) => {
        store.users[id] = {
          password,
          ...createdUserWithoutPassword,
        };

        this.storeData$ = of(store);

        return createdUserWithoutPassword;
      }),
    );
  }

  updateUserPassword(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Observable<UserWithoutPassword> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.users[id]) {
          return null;
        }

        const { password, ...user } = store.users[id];
        if (password !== oldPassword) {
          throw new HttpException('Old password is incorect', 403);
        }

        const updatedUser: UserWithoutPassword = {
          ...user,
          updatedAt: Date.now(),
          version: user.version + 1,
        };

        store.users[id] = {
          ...updatedUser,
          password: newPassword,
        };

        this.storeData$ = of(store);

        return updatedUser;
      }),
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.users[id]) {
          throw new HttpException('User is not with us', 404);
        }

        delete store.users[id];

        this.storeData$ = of(store);
      }),
    );
  }

  getTracks(): Observable<Track[]> {
    return this.storeData$.pipe(map(({ tracks }) => Object.values(tracks)));
  }

  getTrack(id: string): Observable<Track> {
    return this.storeData$.pipe(map(({ tracks }) => tracks[id]));
  }

  createTrack(track: CreateTrackDto): Observable<Track> {
    const id = v4();
    const createdTrack: Track = {
      id,
      ...track,
      albumId: track.albumId ?? null,
      artistId: track.artistId ?? null,
    };

    return this.storeData$.pipe(
      map((store) => {
        store.tracks[id] = createdTrack;

        this.storeData$ = of(store);

        return createdTrack;
      }),
    );
  }

  updateTrack(id: string, track: UpdateTrackDto): Observable<Track> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.tracks[id]) {
          return null;
        }

        const updatedTrack: Track = {
          ...store.tracks[id],
          ...track,
        };

        store.tracks[id] = updatedTrack;

        this.storeData$ = of(store);

        return updatedTrack;
      }),
    );
  }

  deleteTrack(id: string): Observable<void> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.tracks[id]) {
          throw new HttpException('Track is not with us', 404);
        }

        const trackInFavsIndex = store.favorites.tracks.indexOf(id);
        if (trackInFavsIndex !== -1) {
          store.favorites.tracks.splice(trackInFavsIndex, 1);
        }

        delete store.tracks[id];

        this.storeData$ = of(store);
      }),
    );
  }

  getArtists(): Observable<Artist[]> {
    return this.storeData$.pipe(map(({ artists }) => Object.values(artists)));
  }

  getArtist(id: string): Observable<Artist> {
    return this.storeData$.pipe(map(({ artists }) => artists[id]));
  }

  createArtist(artist: CreateArtistDto): Observable<Artist> {
    const id = v4();
    const createdArtist: Artist = { id, ...artist };

    return this.storeData$.pipe(
      map((store) => {
        store.artists[id] = createdArtist;

        this.storeData$ = of(store);

        return createdArtist;
      }),
    );
  }

  updateArtist(id: string, artist: UpdateArtistDto): Observable<Artist> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.artists[id]) {
          return null;
        }

        const updatedArtist: Artist = {
          ...store.artists[id],
          ...artist,
        };

        store.artists[id] = updatedArtist;

        this.storeData$ = of(store);

        return updatedArtist;
      }),
    );
  }

  deleteArtist(id: string): Observable<void> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.artists[id]) {
          throw new HttpException('Artist is not with us', 404);
        }

        Object.keys(store.tracks).forEach((trackId) => {
          if (store.tracks[trackId].artistId === id) {
            store.tracks[trackId].artistId = null;
          }
        });

        Object.keys(store.albums).forEach((albumId) => {
          if (store.albums[albumId].artistId === id) {
            store.albums[albumId].artistId = null;
          }
        });

        const artistInFavsIndex = store.favorites.artists.indexOf(id);
        if (artistInFavsIndex !== -1) {
          store.favorites.artists.splice(artistInFavsIndex, 1);
        }

        delete store.artists[id];

        this.storeData$ = of(store);
      }),
    );
  }

  getAlbums(): Observable<Album[]> {
    return this.storeData$.pipe(map(({ albums }) => Object.values(albums)));
  }

  getAlbum(id: string): Observable<Album> {
    return this.storeData$.pipe(map(({ albums }) => albums[id]));
  }

  createAlbum(album: CreateAlbumDto): Observable<Album> {
    const id = v4();
    const createdAlbum: Album = {
      id,
      ...album,
      artistId: album.artistId ?? null,
    };

    return this.storeData$.pipe(
      map((store) => {
        store.albums[id] = createdAlbum;

        this.storeData$ = of(store);

        return createdAlbum;
      }),
    );
  }

  updateAlbum(id: string, album: UpdateAlbumDto): Observable<Album> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.albums[id]) {
          return null;
        }

        const updatedAlbum: Album = {
          ...store.albums[id],
          ...album,
        };

        store.albums[id] = updatedAlbum;

        this.storeData$ = of(store);

        return updatedAlbum;
      }),
    );
  }

  deleteAlbum(id: string): Observable<void> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.albums[id]) {
          throw new HttpException('Album is not with us', 404);
        }

        Object.keys(store.tracks).forEach((trackId) => {
          if (store.tracks[trackId].albumId === id) {
            store.tracks[trackId].albumId = null;
          }
        });

        const albumInFavsIndex = store.favorites.albums.indexOf(id);
        if (albumInFavsIndex !== -1) {
          store.favorites.albums.splice(albumInFavsIndex, 1);
        }

        delete store.albums[id];

        this.storeData$ = of(store);
      }),
    );
  }

  getFavorites(): Observable<FavoritesResponse> {
    return this.storeData$.pipe(
      map(({ albums, artists, tracks, favorites }) => ({
        albums: favorites.albums.map((albumId) => albums[albumId]),
        tracks: favorites.tracks.map((trackId) => tracks[trackId]),
        artists: favorites.artists.map((artistId) => artists[artistId]),
      })),
    );
  }

  addTrackToFavorites(id: string): Observable<string> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.tracks[id]) {
          return null;
        }

        if (!store.favorites.tracks.includes(id)) {
          store.favorites.tracks.push(id);
        }

        this.storeData$ = of(store);

        return 'Track was added';
      }),
    );
  }

  deleteTrackFromFavorites(id: string): Observable<void> {
    return this.storeData$.pipe(
      map((store) => {
        const trackInFavsIndex = store.favorites.tracks.indexOf(id);
        if (trackInFavsIndex === -1 || !store.tracks[id]) {
          throw new HttpException('Track is not favorite, or not with us', 404);
        }

        store.favorites.tracks.splice(trackInFavsIndex, 1);

        this.storeData$ = of(store);
      }),
    );
  }

  addAlbumToFavorites(id: string): Observable<string> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.albums[id]) {
          return null;
        }

        if (!store.favorites.albums.includes(id)) {
          store.favorites.albums.push(id);
        }

        this.storeData$ = of(store);

        return 'Album was added';
      }),
    );
  }

  deleteAlbumFromFavorites(id: string): Observable<void> {
    return this.storeData$.pipe(
      map((store) => {
        const albumInFavsIndex = store.favorites.albums.indexOf(id);
        if (albumInFavsIndex === -1 || !store.albums[id]) {
          throw new HttpException('Album is not favorite, or not with us', 404);
        }

        store.favorites.albums.splice(albumInFavsIndex, 1);

        this.storeData$ = of(store);
      }),
    );
  }

  addArtistToFavorites(id: string): Observable<string> {
    return this.storeData$.pipe(
      map((store) => {
        if (!store.artists[id]) {
          return null;
        }

        if (!store.favorites.artists.includes(id)) {
          store.favorites.artists.push(id);
        }

        this.storeData$ = of(store);

        return 'Artist was added';
      }),
    );
  }

  deleteArtistFromFavorites(id: string): Observable<void> {
    return this.storeData$.pipe(
      map((store) => {
        const artistInFavsIndex = store.favorites.artists.indexOf(id);
        if (artistInFavsIndex === -1 || !store.artists[id]) {
          throw new HttpException(
            'Artist is not favorite, or not with us',
            404,
          );
        }

        store.favorites.artists.splice(artistInFavsIndex, 1);

        this.storeData$ = of(store);
      }),
    );
  }
}
