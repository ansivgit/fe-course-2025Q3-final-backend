import { Router } from 'express';
import { ROUTES } from '../constants/constants';
import { AuthController } from '../controllers';

const authRouter = Router();

const authController = new AuthController();

// authRouter.get('/', authController.getUser.bind(authController));

authRouter.post(ROUTES.LOGIN, authController.login.bind(authController));

export { authRouter };
