import type { ObjectId } from 'mongodb';

export type MongoAnswer = {
  acknowledged: boolean;
  insertedId: ObjectId;
};
