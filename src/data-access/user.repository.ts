import users from '../../data/users.json';
import { RES_ERROR_MESSAGES } from '../constants/constants';
import type { User, UserProfile } from '../types/user';

export class UserRepository {
  public async getUsersList(): Promise<User[]> {
    try {
      const usersList: User[] = await users;
      return usersList;
    } catch (error: unknown) {
      const _error =
        error instanceof Error ? new Error(error.message) : new Error(RES_ERROR_MESSAGES['500']);
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
        error instanceof Error ? new Error(error.message) : new Error(RES_ERROR_MESSAGES['500']);
      throw _error;
    }
  }
}
