import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { Album } from './entities/album.entity';
import { AlbumController } from './album.controller';
import { AlbumService } from './services/album.service';
import { AlbumDbService } from './services/album.db.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumDbService],
  exports: [AlbumService],
})
export class AlbumModule {}
