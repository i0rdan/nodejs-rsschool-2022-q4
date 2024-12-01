import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Album } from 'src/album/entities/album.entity';
import { Track } from 'src/track/entities/track.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Album, (a) => a.artist, {
    cascade: true,
  })
  @Exclude()
  albums: Album[];

  @OneToMany(() => Track, (t) => t.artist, {
    cascade: true,
  })
  @Exclude()
  tracks: Track[];
}
