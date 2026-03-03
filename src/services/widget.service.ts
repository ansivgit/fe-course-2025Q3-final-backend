import fs from 'node:fs/promises';
import path from 'node:path';


import { BadRequestError, NotFoundError } from '../errors';
import type { Widget } from '../schemas/widget';


import { ERROR_MESSAGES } from '../constants';

import { QuizWidgetSchema, validateWidgets } from '../schemas/widget';

export class WidgetService {
  public async getWidgetsByType(type: string): Promise<Widget[]> {
    const filePath = path.resolve('data/widgets', `${type}.json`);

    let data: unknown;

    try {
      const rawData = await fs.readFile(filePath, 'utf8');
      data = JSON.parse(rawData);
    } catch (error: unknown) {
      if (this.isFileNotFoundError(error)) {
        throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND);
      }
      throw error;
    }

    const validationResult = validateWidgets<Widget>(data, QuizWidgetSchema);

    if (!validationResult.success) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST, {
        details: validationResult.errors,
      });
    }

    return validationResult.data;
  }

  private isFileNotFoundError(error: unknown): boolean {
    return error instanceof Error && error.message.includes('no such file or directory');
  }
}
