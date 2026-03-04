import type { NextFunction, Request, Response } from 'express';

import { BadRequestError } from '../errors';
import type { Widget } from '../schemas/widget';
import { WidgetService } from '../services';

import { CONSTANTS, ERROR_MESSAGES } from '../constants';

type WidgetParams = {
  type: string;
};

export class WidgetController {
  private readonly widgetService: WidgetService;

  constructor() {
    this.widgetService = new WidgetService();
  }

  public async getWidgetsByType(
    req: Request<WidgetParams>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const widgetType: string | undefined = req.params.type.trim();

      if (!widgetType) {
        throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
      }

      const widgets: Widget[] = await this.widgetService.getWidgetsByType(widgetType);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: widgets,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
