import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { typeOrmConfig } from 'typeorm.config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artist/artist.module';
import { FavoritesModule } from './favorites/favorites.module';
import { LoggingMiddleware } from './shared/middlewares/logging.middleware';
import { CustomExceptionFilter } from './shared/exception-filters/exception-filter';
import { LoggingService } from './shared/services/logging.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TrackModule,
    AlbumModule,
    ArtistModule,
    FavoritesModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
  providers: [
    LoggingService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
