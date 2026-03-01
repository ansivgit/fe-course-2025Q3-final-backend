import { ERROR_MESSAGES } from '../constants/index.js';

import users from '../../data/users.json' with { type: 'json' };
import { DatabaseError } from '../errors/index.js';
import type { User, UserProfile } from '../types/index.js';

export class UserRepository {
  public async getUsersList(): Promise<User[]> {
    try {
      const usersList: User[] = await users;
      return usersList;
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  public async getUser(login: User['login']): Promise<User | undefined> {
    const usersList: User[] = await this.getUsersList();
    return usersList.find((user) => user.login === login);
  }

  public async create(user: User): Promise<UserProfile | undefined> {
    const usersList: User[] = await this.getUsersList();

    try {
      usersList.push(user);
      return user;
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}
