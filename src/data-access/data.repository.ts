import { DatabaseError } from '../errors';
import type { Widget } from '../schemas';
import { getDb } from './db-connection';

import type { MongoAnswer } from '../types';

const COLLECTION = 'widgets';

export class DataRepository {
  public async getWidgetsByType<T extends Widget>(
    widgetType: string,
  ): Promise<Omit<T, 'id'>[] | null> {
    try {
      const imported: { default: Omit<T, 'id'>[] } = await import(
        `../../data/widgets/${widgetType}.json`
      );
      return imported.default;
    } catch {
      return null;
    }
  }

  public async create(widget: Omit<Widget, 'id'>): Promise<MongoAnswer> {
    try {
      const db = await getDb();
      const result: MongoAnswer = await db.collection(COLLECTION).insertOne(widget);

      return result;
    } catch {
      throw new DatabaseError('Widget creation failed');
    }
  }
}
