import { ROUTES } from '../constants/index.js';

import { Router } from 'express';
import { AuthController } from '../controllers/index.js';

const authRouter = Router();

const authController = new AuthController();

authRouter.post(ROUTES.LOGIN, authController.login.bind(authController));

authRouter.post(ROUTES.SIGNUP, authController.signup.bind(authController));

export { authRouter };
