import { RES_ERROR_MESSAGES } from '../constants/constants';
import { UserRepository } from '../data-access';
import type { LoginUser, User, UserProfile } from '../types/user';

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // public async getUser(login: string): Promise<User> {
  //   const user: User | undefined = await this.userRepository.getUser(login);

  //   if (!user) {
  //     throw new Error('User not found!');
  //   }
  //   return user;
  // }

  public async login(loginData: LoginUser): Promise<UserProfile> {
    const { login, password } = loginData;

    const user: User | undefined = await this.userRepository.getUser(login);

    if (!user) {
      throw new Error(RES_ERROR_MESSAGES['403_login']);
    }

    const isValid = password === user.password;

    if (!isValid) {
      throw new Error(RES_ERROR_MESSAGES['403_pswd']);
    }

    const { password: _, ...rest } = user;

    return rest;
  }
}
