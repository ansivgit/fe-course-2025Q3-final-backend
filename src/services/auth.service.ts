import { v4 } from 'uuid';
import { RES_ERROR_MESSAGES } from '../constants/constants';
import { UserRepository } from '../data-access';
import type { LoginUser, NewUser, User, UserProfile } from '../types/user';

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private async getUser(login: string): Promise<User | undefined> {
    try {
      return await this.userRepository.getUser(login);
    } catch (error: unknown) {
      const _error =
        error instanceof Error ? new Error(error.message) : new Error(RES_ERROR_MESSAGES['500']);
      throw _error;
    }
  }

  public async login(userData: LoginUser): Promise<UserProfile> {
    const { login, password } = userData;

    const user: User | undefined = await this.getUser(login);

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

  public async signup(userData: NewUser): Promise<UserProfile> {
    const { login, password, name } = userData;

    const user: User | undefined = await this.getUser(login);

    if (user) {
      throw new Error(RES_ERROR_MESSAGES['409']);
    }

    if (!password || !name) {
      throw new Error(RES_ERROR_MESSAGES['400']);
    }

    const userInfo: User = {
      ...userData,
      id: v4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      session: [],
      settings: {},
    };

    try {
      await this.userRepository.create(userInfo);

      const usersList: User[] = await this.userRepository.getUsersList();
      console.log('usersList', usersList);
    } catch (error: unknown) {
      const _error =
        error instanceof Error ? new Error(error.message) : new Error(RES_ERROR_MESSAGES['500']);
      throw _error;
    }

    const { password: _, ...rest } = userInfo;
    return rest;
  }
}
