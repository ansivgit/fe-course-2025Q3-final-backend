import type { NextFunction, Request, Response } from 'express';

import { WidgetService } from '../services';

import { CONSTANTS } from '../constants';

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
      const widgetType = req.params.type;

      const widgets = await this.widgetService.getWidgetsByType(widgetType);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: widgets,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
