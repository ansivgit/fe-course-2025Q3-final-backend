import { Router } from 'express';

import { ProgressController } from '../controllers';

const progressRouter = Router();

const progressController = new ProgressController();

progressRouter.get('/', progressController.getProgress.bind(progressController));

progressRouter.put('/', progressController.update.bind(progressController));

export { progressRouter };
