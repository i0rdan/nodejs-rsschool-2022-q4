import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable } from '@nestjs/common';

import { hash, genSalt, compare } from 'bcrypt';
import { combineLatest, from, map, Observable, switchMap } from 'rxjs';

import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserWithoutPassword } from 'src/user/interfaces/user-without-password.interface';

import { RefreshDto } from '../dto/refresh.dto';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private cryptSalt = Number(process.env.CRYPT_SALT) || 10;

  private tokenExpireTime = process.env.TOKEN_EXPIRE_TIME || '1h';

  private jwtSecretKey = process.env.JWT_SECRET_KEY || 'secret123123';

  private tokenRefreshExpireTime =
    process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h';

  private jwtSecretRefreshKey =
    process.env.JWT_SECRET_REFRESH_KEY || 'secret123123';

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  generateTokens(userId: string, login: string): Observable<AuthTokens> {
    const idWithLogin = { userId, login };
    const jwtTokenOptions = {
      secret: this.jwtSecretKey,
      expiresIn: this.tokenExpireTime,
    };
    const jwtTokenRefreshOptions = {
      secret: this.jwtSecretRefreshKey,
      expiresIn: this.tokenRefreshExpireTime,
    };

    return combineLatest([
      from(this.jwtService.signAsync(idWithLogin, jwtTokenOptions)),
      from(this.jwtService.signAsync(idWithLogin, jwtTokenRefreshOptions)),
    ]).pipe(
      map(([accessToken, refreshToken]) => ({ accessToken, refreshToken })),
    );
  }

  refreshTokens({ refreshToken }: RefreshDto): Observable<AuthTokens> {
    if (!this.jwtService.verify(refreshToken)) {
      throw new HttpException('Refresh token expired or invalid', 403);
    }

    const { id, login } = this.jwtService.decode(refreshToken) as User;
    return this.generateTokens(id, login);
  }

  logIn({ login, password }: CreateUserDto): Observable<AuthTokens> {
    return this.userService.getUsersWithPass().pipe(
      switchMap((users) => {
        const currUser = users.find((u) => u.login === login);
        if (!currUser) {
          throw new HttpException('No such user', 403);
        }

        return from(compare(password, currUser.password)).pipe(
          switchMap((isEqual) => {
            if (!isEqual) {
              throw new HttpException('Wrong password', 403);
            }
            return this.generateTokens(currUser.id, currUser.login);
          }),
        );
      }),
    );
  }

  signUp({ login, password }: CreateUserDto): Observable<UserWithoutPassword> {
    return from(genSalt(this.cryptSalt)).pipe(
      switchMap((salt) =>
        from(hash(password, salt)).pipe(
          switchMap((hashedPass) =>
            this.userService.createUser({ login, password: hashedPass }),
          ),
        ),
      ),
    );
  }
}
