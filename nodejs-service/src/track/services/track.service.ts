import { Injectable, HttpException } from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { Track } from '../interfaces/track.interface';
import { TrackDbService } from './track.db.service';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(private trackDbService: TrackDbService) {}

  getTracks(): Observable<Track[]> {
    return this.trackDbService.getTracks();
  }

  getTrack(id: string): Observable<Track> {
    return this.trackDbService.getTrack(id).pipe(
      map((track) => {
        if (!track) {
          throw new HttpException('Track is not with us', 404);
        }
        return track;
      }),
    );
  }

  createTrack(data: CreateTrackDto): Observable<Track> {
    return this.trackDbService.createTrack(data);
  }

  updateTrack(id: string, data: UpdateTrackDto): Observable<Track> {
    return this.trackDbService.updateTrack(id, data).pipe(
      map((track) => {
        if (!track) {
          throw new HttpException('Track is not with us', 404);
        }
        return track;
      }),
    );
  }

  deleteTrack(id: string): Observable<void> {
    return this.trackDbService.deleteTrack(id);
  }
}
