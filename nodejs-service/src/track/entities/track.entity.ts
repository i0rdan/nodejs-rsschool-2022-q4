import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column({ nullable: true })
  albumId: string;

  @Column({ nullable: true })
  artistId: string;

  @ManyToOne(() => Album, (a) => a.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Exclude()
  album: Album;

  @ManyToOne(() => Artist, (a) => a.tracks, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Exclude()
  artist: Artist;
}
