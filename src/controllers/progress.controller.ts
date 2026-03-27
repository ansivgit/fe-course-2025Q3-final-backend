import type { NextFunction, Request, Response } from 'express';

import { BadRequestError } from '../errors';
import { ProgressService } from '../services';

import { CONSTANTS, ERROR_MESSAGES } from '../constants';
import type { ProgressData } from '../types';

export class ProgressController {
  private readonly progressService: ProgressService;

  constructor() {
    this.progressService = new ProgressService();
  }

  public async getProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: Record<string, unknown> = req.body;

      if (typeof userData.id !== 'string') {
        throw new BadRequestError(ERROR_MESSAGES.BAD_REQUEST);
      }

      const entity: ProgressData = await this.progressService.getProgress(userData.id);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: entity,
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

      const entity: ProgressData = await this.progressService.updateProgress(id, rest);

      res.status(CONSTANTS.HTTP_STATUS_OK).send({
        data: entity,
        error: null,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}
