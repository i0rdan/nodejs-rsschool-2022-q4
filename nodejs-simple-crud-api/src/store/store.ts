import { v1 } from "uuid";

import { User } from "../interfaces/User";
import { ERRORS_MAP } from "../utils/constants/constants";

class Store {
  private users: User[] = [
    { id: v1(), username: 'user 1', age: 66, hobbies: ['reading'] },
    { id: v1(), username: 'user 2', age: 12, hobbies: ['golf', 'jokes'] },
    { id: v1(), username: 'user 3', age: 22, hobbies: ['gaming'] },
    { id: v1(), username: 'user 4', age: 31, hobbies: ['programming'] },
    { id: v1(), username: 'user 5', age: 41, hobbies: [] },
  ];

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (user) {
      return user;
    }
    throw new Error(ERRORS_MAP.NO_USER);
  }

  addUser(user: User): User {
    const newUser = { ...user, id: v1() };
    this.users.push(newUser);
    return newUser;
  }

  deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      this.users.splice(userIndex, 1);
      return true;
    }
    throw new Error(ERRORS_MAP.NO_USER);
  }

  updateUser(user: User): User {
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...user,
      };
      return this.users[userIndex];
    }
    throw new Error(ERRORS_MAP.NO_USER);
  }

  setUsers(users: User[]): void {
    this.users = [...users];
  }
}

export const store = new Store();
