import { ObjectId } from 'mongodb';

import { UserRepository } from '../data-access';
import { BadRequestError, ConflictError, DatabaseError, UserNotFoundError } from '../errors';

import { ERROR_MESSAGES } from '../constants';
import type { LoginUser, MongoAnswer, NewUser, User, UserProfile } from '../types';

const LOGIN_ERROR_MESSAGES = {
  INVALID_PSWD: 'Invalid password',
  USER_EXISTS: 'User already exist. Please login',
};

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private async getUser(login: string): Promise<User | null> {
    try {
      return await this.userRepository.getUser(login);
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  public async login(userData: LoginUser): Promise<UserProfile> {
    const { login, password } = userData;

    const user: User | null = await this.getUser(login);

    if (!user) {
      throw new UserNotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
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

    const user: User | null = await this.getUser(login);

    if (user) {
      throw new ConflictError(LOGIN_ERROR_MESSAGES.USER_EXISTS);
    }

    if (!password || !name) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    const userInfo: Omit<User, '_id'> = {
      ...userData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      session: [],
      settings: {},
    };

    try {
      const result: MongoAnswer = await this.userRepository.create(userInfo);
      const { password: _, ...rest } = userInfo;

      return { ...rest, _id: new ObjectId(result.insertedId) };
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }
}
