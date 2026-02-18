import { Router } from 'express';
import { UserController } from './../controllers';

const userRouter = Router();

const userController = new UserController();

userRouter.get('/', userController.getUserOne.bind(userController));

export { userRouter };
