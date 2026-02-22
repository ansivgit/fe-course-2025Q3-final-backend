import { Router } from 'express';
import { UserController } from '../controllers';

const userRouter = Router();

const userController = new UserController();

userRouter.get('/', userController.getUser.bind(userController));

export { userRouter };
