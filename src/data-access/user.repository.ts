import users from '../../data/users.json';
import { ERROR_MESSAGES } from '../constants';
import { DatabaseError } from '../errors';
import type { User, UserProfile } from '../types';

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
