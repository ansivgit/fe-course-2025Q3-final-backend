import { Router } from 'express';

import { ProgressController } from '../controllers';

const progressRouter = Router();

const progressController = new ProgressController();

progressRouter.get('/:userId', progressController.getProgress.bind(progressController));

progressRouter.put('/:userId', progressController.update.bind(progressController));

export { progressRouter };
