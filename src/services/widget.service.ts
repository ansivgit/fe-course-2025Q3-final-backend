import type z from 'zod';

import { DataRepository } from '../data-access/data.repository';
import { BadRequestError } from '../errors';
import type { Widget, WidgetValidation } from '../schemas/widget';
import { MatchWidgetSchema, QuizWidgetSchema } from '../schemas';
import { validateWidgets } from '../utils/validation';

import { ERROR_MESSAGES } from '../constants';

export class WidgetService {
  private readonly widgetRepository: DataRepository;

  constructor() {
    this.widgetRepository = new DataRepository();
  }

  public async getWidgetsByType(widgetType: string): Promise<Widget[]> {
    const data: unknown = await this.widgetRepository.getWidgetsByType(widgetType);

    if (!data) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    let schema: z.ZodType<Widget>;
    if (widgetType === 'quiz') {
      schema = QuizWidgetSchema;
    } else if (widgetType === 'match-game') {
      schema = MatchWidgetSchema;
    } else {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    const validatedWidgets: WidgetValidation = validateWidgets<Widget>(data, schema);

    return validatedWidgets;
  }
}
