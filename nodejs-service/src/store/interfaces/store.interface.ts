import { Album } from 'src/album/interfaces/album.interface';
import { Artist } from 'src/artist/interfaces/artist.interface';
import { Favorites } from 'src/favorites/interfaces/favorites.interface';
import { Track } from 'src/track/interfaces/track.interface';
import { User } from 'src/user/interfaces/user.interface';

export interface StoreInterface {
  favorites: Favorites;
  users: Record<string, User>;
  tracks: Record<string, Track>;
  albums: Record<string, Album>;
  artists: Record<string, Artist>;
}
