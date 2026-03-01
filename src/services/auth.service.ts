import { ERROR_MESSAGES } from '../constants/index.js';

import { v4 } from 'uuid';
import { UserRepository } from '../data-access/index.js';
import { BadRequestError, ConflictError, DatabaseError, NotFoundError } from '../errors/index.js';
import type { LoginUser, NewUser, User, UserProfile } from '../types/index.js';

const LOGIN_ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found. Please sign up',
  INVALID_PSWD: 'Invalid password',
  USER_EXISTS: 'User already exist. Please login',
};

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private async getUser(login: string): Promise<User | undefined> {
    try {
      return await this.userRepository.getUser(login);
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  public async login(userData: LoginUser): Promise<UserProfile> {
    const { login, password } = userData;

    const user: User | undefined = await this.getUser(login);

    if (!user) {
      throw new NotFoundError(LOGIN_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const isValid = password === user.password;

    if (!isValid) {
      throw new BadRequestError(LOGIN_ERROR_MESSAGES.INVALID_PSWD);
    }

    const { password: _, ...rest } = user;
    return rest;
  }

  public async signup(userData: NewUser): Promise<UserProfile> {
    const { login, password, name } = userData;

    const user: User | undefined = await this.getUser(login);

    if (user) {
      throw new ConflictError(LOGIN_ERROR_MESSAGES.USER_EXISTS);
    }

    if (!password || !name) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
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
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }

    const { password: _, ...rest } = userInfo;
    return rest;
  }
}
