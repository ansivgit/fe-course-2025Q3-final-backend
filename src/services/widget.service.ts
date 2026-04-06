import { DataRepository } from '../data-access';
import { BadRequestError } from '../errors';
import { getWidgetSchema, type Widget, type WidgetType, type WidgetValidation } from '../schemas';
import { validateWidgets } from '../utils';

import { ERROR_MESSAGES } from '../constants';

export class WidgetService {
  private readonly dataRepository: DataRepository;

  constructor() {
    this.dataRepository = new DataRepository();
  }

  public async getWidgetsByType(widgetType: WidgetType): Promise<Widget[]> {
    const data: Widget[] = await this.dataRepository.getWidgetsByType(widgetType);

    if (data.length === 0) {
      throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
    }

    const schema = getWidgetSchema(widgetType);

    const validatedWidgets: WidgetValidation = validateWidgets<Widget>(data, schema);

    return validatedWidgets;
  }
}
