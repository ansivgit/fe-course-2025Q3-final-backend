import type { Collection } from 'mongodb';

import { DatabaseError } from '../errors';
import type { Widget, WidgetType } from '../schemas';
import { getDb } from './db-connection';

import { DB_COLLECTIONS, ERROR_MESSAGES } from '../constants';

const COLLECTION = DB_COLLECTIONS.DATA;

export class DataRepository {
  private async getDbCollection(widgetType: WidgetType): Promise<Collection<Widget>> {
    try {
      const db = await getDb();

      return db.collection(`${COLLECTION}/${widgetType}`);
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
  }

  public async getWidgetsByType(widgetType: WidgetType): Promise<Widget[]> {
    const collection = await this.getDbCollection(widgetType);
    const widgets: Widget[] = await collection.find().toArray();

    return widgets;
  }
}
