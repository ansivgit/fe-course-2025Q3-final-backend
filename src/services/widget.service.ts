import { DataRepository } from '../data-access/data.repository';
import { BadRequestError } from '../errors';
import type { Widget, WidgetValidation } from '../schemas/widget';
import { QuizWidgetSchema } from '../schemas/widget';
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

    const validatedWidgets: WidgetValidation<Widget> = validateWidgets<Widget>(
      data,
      QuizWidgetSchema,
    );

    return validatedWidgets;
  }
}
