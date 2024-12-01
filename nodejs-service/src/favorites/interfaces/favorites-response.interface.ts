import { Album } from 'src/album/interfaces/album.interface';
import { Track } from 'src/track/interfaces/track.interface';
import { Artist } from 'src/artist/interfaces/artist.interface';

export interface FavoritesResponse {
  albums: Album[];
  tracks: Track[];
  artists: Artist[];
}
