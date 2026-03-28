import { ProgressRepository } from '../data-access';
import { UserNotFoundError } from '../errors';
import { userProgressValidation } from '../utils';

import { ERROR_MESSAGES } from '../constants';
import type { ProgressData, UserProgress } from '../types';

export class ProgressService {
  private readonly progressRepository: ProgressRepository;

  constructor() {
    this.progressRepository = new ProgressRepository();
  }

  public async getProgress(userId: string): Promise<ProgressData> {
    const progress: UserProgress | null = await this.progressRepository.getProgress(userId);
    if (!progress) {
      throw new UserNotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const { _id: _, ...rest } = progress;

    return { ...rest };
  }

  public async updateProgress(
    userId: string,
    progressData: Partial<ProgressData>,
  ): Promise<ProgressData> {
    const validatedData = userProgressValidation(progressData);

    const newProgress: Partial<ProgressData> = {
      ...validatedData,
      updatedAt: Date.now(),
    };

    const result: UserProgress | null = await this.progressRepository.update(userId, newProgress);
    if (!result) {
      throw new UserNotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const { _id: _, ...rest } = result;

    return { ...rest };
  }
}
