import { Router } from 'express';
import { ROUTES } from '../constants/constants';
import { AuthController } from '../controllers';

const authRouter = Router();

const authController = new AuthController();

authRouter.post(ROUTES.LOGIN, authController.login.bind(authController));

authRouter.post(ROUTES.SIGNUP, authController.signup.bind(authController));

export { authRouter };
