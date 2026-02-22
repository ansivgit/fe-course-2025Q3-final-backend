import { Router } from 'express';
import { AuthController } from '../controllers';

const authRouter = Router();

const authController = new AuthController();

authRouter.get('/', authController.getUser.bind(authController));

export { authRouter };
