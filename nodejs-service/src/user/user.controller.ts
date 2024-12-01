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

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserWithoutPassword } from './interfaces/user-without-password.interface';
import { UserService } from './services/user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(): Observable<UserWithoutPassword[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUser(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Observable<UserWithoutPassword> {
    return this.userService.getUser(id);
  }

  @Post()
  createUser(
    @Body(new ValidationPipe()) body: CreateUserDto,
  ): Observable<UserWithoutPassword> {
    return this.userService.createUser(body);
  }

  @Put(':id')
  updateUserPassword(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidationPipe()) body: UpdatePasswordDto,
  ): Observable<UserWithoutPassword> {
    return this.userService.updateUserPassword(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string): Observable<void> {
    return this.userService.deleteUser(id);
  }
}
