import type { NextFunction, Request, Response } from 'express';
import { CONSTANTS } from '../constants/constants';
import { AuthService } from '../services';
import type { LoginUser, NewUser, UserProfile } from '../types';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: LoginUser | undefined = req.body;

      if (!userData) {
        throw new Error('Login and password required');
      }

      const user: UserProfile = await this.authService.login(userData);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      console.info('error', error);
      next(error);
    }
  }

  public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: NewUser | undefined = req.body;

      if (!userData) {
        throw new Error('User data required');
      }

      const user: UserProfile = await this.authService.signup(userData);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      console.info('error', error);
      next(error);
    }
  }
}
