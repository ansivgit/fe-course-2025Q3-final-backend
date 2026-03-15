import { DataRepository } from '../data-access';
import { BadRequestError } from '../errors';
import { getWidgetSchema, type Widget, type WidgetValidation } from '../schemas';
import { validateWidgets } from '../utils';

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

    const schema = getWidgetSchema(widgetType);

    const validatedWidgets: WidgetValidation = validateWidgets<Widget>(data, schema);

    return validatedWidgets;
  }
}
