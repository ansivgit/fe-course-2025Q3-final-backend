import { Router } from 'express';

import { AuthController } from '../controllers';
import { NewUserSchema } from '../schemas';
import { requestValidation } from '../utils';

import { ROUTES } from '../constants';

const authRouter = Router();

const authController = new AuthController();

authRouter.post(ROUTES.LOGIN, authController.login.bind(authController));

authRouter.post(
  ROUTES.SIGNUP,
  requestValidation(NewUserSchema),
  authController.signup.bind(authController),
);

export { authRouter };
