import { Router } from 'express';

import { UserController } from '../controllers';

const userRouter = Router();

const userController = new UserController();

userRouter.put('/', userController.update.bind(userController));

userRouter.delete('/', userController.delete.bind(userController));

export { userRouter };
