import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string;

  @OneToMany(() => Track, (t) => t.album, {
    cascade: true,
  })
  @Exclude()
  tracks: Track[];

  @ManyToOne(() => Artist, (a) => a.albums, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Exclude()
  artist: Artist;
}
