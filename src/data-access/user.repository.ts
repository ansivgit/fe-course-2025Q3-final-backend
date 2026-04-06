import type { Collection, ObjectId } from 'mongodb';

import { DatabaseError } from '../errors';
import { getDb } from './db-connection';

import { DB_COLLECTIONS, ERROR_MESSAGES, INIT_PROGRESS } from '../constants';
import type { MongoAnswer, User } from '../types';

const COLLECTION = DB_COLLECTIONS.USERS;

export class UserRepository {
  private async getDbCollection(): Promise<Collection<User>> {
    try {
      const db = await getDb();

      return db.collection(COLLECTION);
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  public async getUsersList(): Promise<User[]> {
    const collection = await this.getDbCollection();
    const usersList: User[] = await collection.find().toArray();

    return usersList;
  }

  public async getUserById(userId: User['_id']): Promise<User | null> {
    const collection = await this.getDbCollection();
    const user: User | null = await collection.findOne({ _id: userId });

    return user;
  }

  public async getUserByLogin(login: User['login']): Promise<User | null> {
    const collection = await this.getDbCollection();
    const user: User | null = await collection.findOne({ login });

    return user;
  }

  public async create(user: Omit<User, '_id'>): Promise<MongoAnswer> {
    try {
      const db = await getDb();
      const userResult: MongoAnswer = await db.collection(COLLECTION).insertOne(user);
      await db
        .collection(DB_COLLECTIONS.PROGRESS)
        .insertOne({ ...INIT_PROGRESS, userId: userResult.insertedId.toString() });

      return userResult;
    } catch {
      throw new DatabaseError('User creation failed');
    }
  }

  public async update(
    userId: ObjectId,
    userData: Partial<Omit<User, '_id'>>,
  ): Promise<User | null> {
    try {
      const collection = await this.getDbCollection();

      const result: User | null = await collection.findOneAndUpdate(
        { _id: userId },
        { $set: userData },
        { returnDocument: 'after' },
      );

      return result;
    } catch {
      throw new DatabaseError('User update failed');
    }
  }

  public async remove(userId: ObjectId): Promise<boolean> {
    try {
      const db = await getDb();

      const userResult = await db.collection(DB_COLLECTIONS.USERS).deleteOne({ _id: userId }); // method returns number of deleted documents
      const scoreResult = await db
        .collection(DB_COLLECTIONS.PROGRESS)
        .deleteOne({ userId: userId.toString() });

      return userResult.deletedCount === 1 && scoreResult.deletedCount === 1;
    } catch {
      throw new DatabaseError('User delete failed');
    }
  }
}
