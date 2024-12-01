import { Injectable, HttpException } from '@nestjs/common';

import { Observable, map } from 'rxjs';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { User } from '../entities/user.entity';
import { UserWithoutPassword } from '../interfaces/user-without-password.interface';
import { UserDbService } from './user.db.service';

@Injectable()
export class UserService {
  constructor(private userDbService: UserDbService) {}

  getUsersWithPass(): Observable<User[]> {
    return this.userDbService
      .getUsersWithPass()
      .pipe(
        map((users) =>
          users.map((u) => this.transformDateFieldsToNumber(u) as User),
        ),
      );
  }

  getUsers(): Observable<UserWithoutPassword[]> {
    return this.userDbService
      .getUsers()
      .pipe(
        map((users) => users.map((u) => this.transformDateFieldsToNumber(u))),
      );
  }

  getUser(id: string): Observable<UserWithoutPassword> {
    return this.userDbService.getUser(id).pipe(
      map((user) => {
        if (!user) {
          throw new HttpException('User is not with us', 404);
        }
        return this.transformDateFieldsToNumber(user);
      }),
    );
  }

  createUser(data: CreateUserDto): Observable<UserWithoutPassword> {
    return this.userDbService
      .createUser(data)
      .pipe(map((user) => this.transformDateFieldsToNumber(user)));
  }

  updateUserPassword(
    id: string,
    data: UpdatePasswordDto,
  ): Observable<UserWithoutPassword> {
    return this.userDbService.updateUserPassword(id, data).pipe(
      map((user) => {
        if (!user) {
          throw new HttpException('User is not with us', 404);
        }
        return this.transformDateFieldsToNumber(user);
      }),
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.userDbService.deleteUser(id);
  }

  transformDateFieldsToNumber(user: UserWithoutPassword): UserWithoutPassword {
    return {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }
}
