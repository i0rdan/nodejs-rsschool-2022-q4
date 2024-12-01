import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Observable, map, from, switchMap, of } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { User } from '../entities/user.entity';
import { UserWithoutPassword } from '../interfaces/user-without-password.interface';

@Injectable()
export class UserDbService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  getUsersWithPass(): Observable<User[]> {
    return from(this.userRepo.find());
  }

  getUsers(): Observable<UserWithoutPassword[]> {
    return from(this.userRepo.find()).pipe(
      map((users) => users.map(({ password, ...user }) => user)),
    );
  }

  getUser(id: string): Observable<UserWithoutPassword> {
    return from(this.userRepo.findOne({ where: { id } })).pipe(
      map((u) => {
        if (!u) {
          return null;
        }
        const { password, ...user } = u;
        return user;
      }),
    );
  }

  createUser(payload: CreateUserDto): Observable<UserWithoutPassword> {
    const createdUser = this.userRepo.create({
      id: v4(),
      ...payload,
      version: 1,
    });
    return from(this.userRepo.save(createdUser)).pipe(
      map(({ password, ...user }) => user),
    );
  }

  updateUserPassword(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Observable<UserWithoutPassword> {
    return from(this.userRepo.findOne({ where: { id } })).pipe(
      switchMap((u) => {
        if (!u) {
          return of(null);
        }

        const { password } = u;
        if (password !== oldPassword) {
          throw new HttpException('Old password is incorect', 403);
        }

        return from(
          this.userRepo.save({
            ...u,
            password: newPassword,
            version: u.version + 1,
          }),
        ).pipe(map(({ password, ...user }) => user));
      }),
    );
  }

  deleteUser(id: string): Observable<void> {
    return from(this.userRepo.delete(id)).pipe(
      map(({ affected }) => {
        if (!affected) {
          throw new HttpException('User is not with us', 404);
        }
      }),
    );
  }
}
