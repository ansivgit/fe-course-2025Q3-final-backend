import { Router } from 'express';

import { WidgetController } from '../controllers';

import { ROUTES } from '../constants';

const widgetRouter = Router();

const widgetController = new WidgetController();

widgetRouter.get(ROUTES.WIDGETS_BY_TYPE, widgetController.getWidgetsByType.bind(widgetController));

export { widgetRouter };
