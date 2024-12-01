import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Observable, map, from, switchMap, of } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';
import { Track } from '../entities/track.entity';

@Injectable()
export class TrackDbService {
  constructor(
    @InjectRepository(Track)
    private trackRepo: Repository<Track>,
  ) {}

  getTracks(): Observable<Track[]> {
    return from(this.trackRepo.find());
  }

  getTrack(id: string): Observable<Track> {
    return from(this.trackRepo.findOne({ where: { id } }));
  }

  createTrack(track: CreateTrackDto): Observable<Track> {
    const createdTrack: Track = this.trackRepo.create({
      id: v4(),
      ...track,
    });
    return from(this.trackRepo.save(createdTrack));
  }

  updateTrack(id: string, track: UpdateTrackDto): Observable<Track> {
    return this.getTrack(id).pipe(
      switchMap((t) => {
        if (!t) {
          return of(null);
        }
        return from(this.trackRepo.save({ ...t, ...track }));
      }),
    );
  }

  deleteTrack(id: string): Observable<void> {
    return from(this.trackRepo.delete(id)).pipe(
      map(({ affected }) => {
        if (!affected) {
          throw new HttpException('Track is not with us', 404);
        }
      }),
    );
  }
}
