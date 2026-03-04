import { BadRequestError } from '../errors';
import type { Widget } from '../schemas/widget';
import { QuizWidgetSchema } from '../schemas/widget';
import { validateWidgets } from '../utils/validation';

import { ERROR_MESSAGES } from '../constants';

export class WidgetService {
  public async getWidgetsByType(widgetType: string): Promise<Widget[]> {
    let data: unknown;

    try {
      const imported: { default: unknown } = await import(`../../data/widgets/${widgetType}.json`);
      data = imported.default;
    } catch {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    const validatedWidgets = validateWidgets<Widget>(data, QuizWidgetSchema);
    return validatedWidgets;
  }
}
