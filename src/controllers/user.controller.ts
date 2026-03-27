import type { NextFunction, Request, Response } from 'express';

import { BadRequestError } from '../errors';
import { UserService } from '../services';

import { CONSTANTS, ERROR_MESSAGES } from '../constants';
import type { UserProfile } from '../types';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: Record<string, unknown> = req.body;

      if (typeof userData.id !== 'string') {
        throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
      }

      const user: UserProfile = await this.userService.getUserById(userData.id);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: Record<string, unknown> = req.body;

      if (typeof userData.id !== 'string') {
        throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
      }

      const { id, ...rest } = userData;

      const user: UserProfile = await this.userService.updateUser(id, rest);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: user,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.body;

      if (typeof id !== 'string') {
        throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
      }

      await this.userService.removeUser(id);

      res.status(CONSTANTS.HTTP_STATUS_NO_CONTENT).send();
    } catch (error: unknown) {
      next(error);
    }
  }
}
