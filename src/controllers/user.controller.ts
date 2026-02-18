import type { NextFunction, Request, Response } from 'express';
import { CONSTANTS } from '../constants/constants';
import { UserService } from '../services';
import type { User } from '../types';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getUserOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const userData: User = req.body;
      const user: User = await this.userService.getUserOne('leo@example.com');

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
