import { ObjectId } from 'mongodb';

import { UserRepository } from '../data-access';
import { BadRequestError, UserNotFoundError } from '../errors';
import { userNameValidation } from '../utils';

import { ERROR_MESSAGES } from '../constants';
import type { User, UserProfile } from '../types';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private getUserId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }
    return new ObjectId(id);
  }

  public async updateUser(id: string, userData: Partial<User>): Promise<UserProfile> {
    const objectId = this.getUserId(id);
    const validatedData = userNameValidation(userData);

    const newUserInfo: Pick<User, 'name' | 'updatedAt'> = {
      ...validatedData,
      updatedAt: Date.now(),
    };

    const result: User | null = await this.userRepository.update(objectId, newUserInfo);
    if (!result) {
      throw new UserNotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const { password: _, ...rest } = result;

    return { ...rest };
  }

  public async removeUser(id: string): Promise<boolean | undefined> {
    const objectId: ObjectId = this.getUserId(id);

    const result: boolean = await this.userRepository.remove(objectId);

    if (!result) {
      throw new UserNotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return result;
  }
}
