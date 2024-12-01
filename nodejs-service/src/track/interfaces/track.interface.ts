export interface Track {
  id: string;
  name: string;
  duration: number;
  albumId: string | null;
  artistId: string | null;
}
