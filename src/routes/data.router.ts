import { Router } from 'express';

import { WidgetController } from '../controllers';

import { ROUTES } from '../constants';

const dataRouter: Router = Router();

const widgetController: WidgetController = new WidgetController();

dataRouter.get(ROUTES.WIDGETS_BY_TYPE, widgetController.getWidgetsByType.bind(widgetController));

export { dataRouter };
