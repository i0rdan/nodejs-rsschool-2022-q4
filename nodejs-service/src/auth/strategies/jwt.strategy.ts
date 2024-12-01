import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/user/services/user.service';
import { UserWithoutPassword } from 'src/user/interfaces/user-without-password.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || 'secret123123',
    });
  }

  validate({ userId }: JwtPayload): Observable<UserWithoutPassword> {
    if (!userId) {
      throw new HttpException('No provided userId in token', 403);
    }
    return this.userService.getUser(userId);
  }
}
