import { Router } from 'express';

import { WidgetController } from '../controllers';

const dataRouter: Router = Router();

const widgetController: WidgetController = new WidgetController();

dataRouter.get('/:type', widgetController.getWidgetsByType.bind(widgetController));

export { dataRouter };
