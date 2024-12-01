import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/user/services/user.service';
import { UserWithoutPassword } from 'src/user/interfaces/user-without-password.interface';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_REFRESH_KEY || 'secret123123',
    });
  }

  validate({ userId }: JwtPayload): Observable<UserWithoutPassword> {
    if (!userId) {
      throw new HttpException('No provided userId in token', 403);
    }
    return this.userService.getUser(userId);
  }
}
