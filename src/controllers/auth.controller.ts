import type { NextFunction, Request, Response } from 'express';
import { CONSTANTS } from '../constants/constants';
import { AuthService } from '../services';
import type { LoginUser, UserProfile } from '../types';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const userData: User = req.body;
  //     console.log('userData from controller', userData);

  //     const user: User = await this.userService.getUser('leo@example.com');

  //     res.status(CONSTANTS.HTTP_STATUS_OK).send({
  //       data: user,
  //       error: null,
  //     });
  //   } catch (error: unknown) {
  //     next(error);
  //   }
  // }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: LoginUser | undefined = req.body;

      if (!userData) {
        throw new Error('Login and password required');
      }
      console.log('userData from controller', userData);

      const user: UserProfile = await this.authService.login(userData);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      console.log('error', error);
      next(error);
    }
  }
}
