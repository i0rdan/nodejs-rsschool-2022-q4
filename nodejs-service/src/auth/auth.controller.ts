import { UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { Observable } from 'rxjs';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserWithoutPassword } from 'src/user/interfaces/user-without-password.interface';

import { AuthService, AuthTokens } from './services/auth.service';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('refresh'))
  @Post('refresh')
  @HttpCode(200)
  refresh(
    @Body(new ValidationPipe()) body: RefreshDto,
  ): Observable<AuthTokens> {
    return this.authService.refreshTokens(body);
  }

  @Post('login')
  @HttpCode(200)
  signIn(
    @Body(new ValidationPipe()) body: CreateUserDto,
  ): Observable<AuthTokens> {
    return this.authService.logIn(body);
  }

  @Post('signup')
  signUp(
    @Body(new ValidationPipe()) body: CreateUserDto,
  ): Observable<UserWithoutPassword> {
    return this.authService.signUp(body);
  }
}
