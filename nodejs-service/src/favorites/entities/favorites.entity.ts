import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column('text', { array: true })
  albums: string[];

  @Column('text', { array: true })
  tracks: string[];

  @Column('text', { array: true })
  artists: string[];
}
