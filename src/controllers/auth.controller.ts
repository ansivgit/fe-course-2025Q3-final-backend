import type { NextFunction, Request, Response } from 'express';
import { CONSTANTS } from '../constants/constants';
import { AuthService } from '../services';
import type { User } from '../types';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const userData: User = req.body;
      const user: User = await this.authService.getUser('leo@example.com');

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
