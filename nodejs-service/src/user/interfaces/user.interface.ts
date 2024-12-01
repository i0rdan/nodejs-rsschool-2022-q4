import { UserWithoutPassword } from './user-without-password.interface';

export interface User extends UserWithoutPassword {
  password: string;
}
