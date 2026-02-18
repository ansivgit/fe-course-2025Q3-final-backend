import users from '../../data/users.json';
import type { User } from './../types/user';

export class UserRepository {
  private async getUsersList(): Promise<User[]> {
    const usersList: User[] = await users;
    return usersList;
  }

  public async getUserOne(login: User['login']): Promise<User | undefined> {
    const usersList: User[] = await this.getUsersList();
    return usersList.find((user) => user.login === login);
  }
}
