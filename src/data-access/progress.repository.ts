import type { Collection } from 'mongodb';

import { DatabaseError } from '../errors';
import { getDb } from './db-connection';

import { DB_COLLECTIONS, ERROR_MESSAGES } from '../constants';
import type { UserProgress } from '../types';

const COLLECTION = DB_COLLECTIONS.PROGRESS;

export class ProgressRepository {
  private async getDbCollection(): Promise<Collection<UserProgress>> {
    try {
      const db = await getDb();

      return db.collection(COLLECTION);
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  public async getProgress(userId: UserProgress['userId']): Promise<UserProgress | null> {
    const collection = await this.getDbCollection();
    const progress: UserProgress | null = await collection.findOne({ userId });

    return progress;
  }

  public async update(
    userId: UserProgress['userId'],
    progressData: Partial<Omit<UserProgress, '_id' | 'userId'>>,
  ): Promise<UserProgress | null> {
    try {
      const collection = await this.getDbCollection();

      const result: UserProgress | null = await collection.findOneAndUpdate(
        { userId },
        { $set: progressData },
        { returnDocument: 'after' },
      );

      return result;
    } catch {
      throw new DatabaseError('User progress update failed');
    }
  }
}
