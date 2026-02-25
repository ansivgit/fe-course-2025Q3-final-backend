import users from '../../data/users.json';
import { ERROR_MESSAGES } from '../constants';
import type { User, UserProfile } from '../types';

export class UserRepository {
  public async getUsersList(): Promise<User[]> {
    try {
      const usersList: User[] = await users;
      return usersList;
    } catch (error: unknown) {
      const _error =
        error instanceof Error
          ? new Error(error.message)
          : new Error(ERROR_MESSAGES.INTERNAL_ERROR);
      throw _error;
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
    } catch (error: unknown) {
      const _error =
        error instanceof Error
          ? new Error(error.message)
          : new Error(ERROR_MESSAGES.INTERNAL_ERROR);
      throw _error;
    }
  }
}
