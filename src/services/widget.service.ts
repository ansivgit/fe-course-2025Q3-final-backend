import { BadRequestError } from '../errors';
import type { ValidationResult, Widget } from '../schemas/widget';
import { QuizWidgetSchema, validateWidgets } from '../schemas/widget';

import { ERROR_MESSAGES } from '../constants';

export class WidgetService {
  public async getWidgetsByType(widgetType: string): Promise<Widget[]> {
    const imported: { default: unknown } = await import(`../../data/widgets/${widgetType}.json`);
    const data: unknown = imported.default;

    const validationResult: ValidationResult<Widget> = validateWidgets<Widget>(
      data,
      QuizWidgetSchema,
    );

    if (!validationResult.success) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    return validationResult.data;
  }
}
