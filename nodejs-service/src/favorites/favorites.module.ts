import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AlbumModule } from 'src/album/album.module';
import { TrackModule } from 'src/track/track.module';
import { ArtistModule } from 'src/artist/artist.module';

import { Favorites } from './entities/favorites.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './services/favorites.service';
import { FavoritesDbService } from './services/favorites.db.service';

@Module({
  imports: [
    AlbumModule,
    TrackModule,
    ArtistModule,
    TypeOrmModule.forFeature([Favorites]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, FavoritesDbService],
})
export class FavoritesModule {}
