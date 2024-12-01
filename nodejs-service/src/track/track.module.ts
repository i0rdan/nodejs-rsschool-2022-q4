import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { Track } from './entities/track.entity';
import { TrackController } from './track.controller';
import { TrackService } from './services/track.service';
import { TrackDbService } from './services/track.db.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [TrackController],
  providers: [TrackService, TrackDbService],
  exports: [TrackService],
})
export class TrackModule {}
