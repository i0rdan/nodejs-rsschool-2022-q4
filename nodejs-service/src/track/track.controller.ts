import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  ValidationPipe,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Observable } from 'rxjs';

import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './services/track.service';

@Controller('track')
@UseGuards(AuthGuard('jwt'))
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  getTracks(): Observable<Track[]> {
    return this.trackService.getTracks();
  }

  @Get(':id')
  getTrack(@Param('id', new ParseUUIDPipe()) id: string): Observable<Track> {
    return this.trackService.getTrack(id);
  }

  @Post()
  createTrack(
    @Body(new ValidationPipe()) body: CreateTrackDto,
  ): Observable<Track> {
    return this.trackService.createTrack(body);
  }

  @Put(':id')
  updateTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) body: UpdateTrackDto,
  ): Observable<Track> {
    return this.trackService.updateTrack(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteTrack(@Param('id', new ParseUUIDPipe()) id: string): Observable<void> {
    return this.trackService.deleteTrack(id);
  }
}
