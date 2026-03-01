import { CONSTANTS, ERROR_MESSAGES } from '../constants/index.js';

import type { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors/index.js';
import { AuthService } from '../services/index.js';
import type { LoginUser, NewUser, UserProfile } from '../types/index.js';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: LoginUser | undefined = req.body;

      if (!userData) {
        throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
      }

      const user: UserProfile = await this.authService.login(userData);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: NewUser | undefined = req.body;

      if (!userData) {
        throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
      }

      const user: UserProfile = await this.authService.signup(userData);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
