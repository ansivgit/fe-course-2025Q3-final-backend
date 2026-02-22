import { UserRepository } from '../data-access';
import type { User } from '../types/user';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async getUser(login: string): Promise<User> {
    const user: User | undefined = await this.userRepository.getUser(login);

    if (!user) {
      throw new Error('User not found!');
    }
    return user;
  }
}
