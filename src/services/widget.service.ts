import { BadRequestError } from '../errors';
import type { Widget } from '../schemas/widget';
import type { WidgetValidationResult } from '../utils/validation';
import { validateWidgets } from '../utils/validation';
import { QuizWidgetSchema } from '../schemas/widget';

import { ERROR_MESSAGES } from '../constants';

export class WidgetService {
  public async getWidgetsByType(widgetType: string): Promise<Widget[]> {
    const imported: { default: unknown } = await import(`../../data/widgets/${widgetType}.json`);
    const data: unknown = imported.default;

    const validationResult: WidgetValidationResult<Widget> = validateWidgets<Widget>(
      data,
      QuizWidgetSchema,
    );

    if (!validationResult.success) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    return validationResult.data;
  }
}
