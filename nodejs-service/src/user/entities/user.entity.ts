import {
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  version: number;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: number;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: number;
}
