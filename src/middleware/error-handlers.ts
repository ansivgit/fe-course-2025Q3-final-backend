import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express';

import { AppError, InternalError } from '../errors';
import { getHttpErrorResponse } from '../utils';

import { ERROR_CODE_KEYS, ERROR_MESSAGES, STATUS_BY_ERROR_CODE } from '../constants';

//* Handler for errors with known status (4xx)
export const errorAuthHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  //* We only skip error handling if it is NOT an AppError or a 5xx error
  if (!(err instanceof AppError) || err.statusCode >= STATUS_BY_ERROR_CODE.INTERNAL_ERROR) {
    next(err);
    return;
  }

  res.status(err.statusCode).send(getHttpErrorResponse(err));
};

//* Handler for all unhandled errors
export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).send(getHttpErrorResponse(err));
    return;
  }

  //* For unknown errors — we are logging in console & return status 500
  console.error('Unhandled error:', err);

  const internalError = new InternalError();
  res.status(internalError.statusCode).send(getHttpErrorResponse(internalError));
};

//* Handler for for non-existent routes (404) - Express has default 404-handler, but we can add our own
//* to handle 404 errors with custom response
export const notFoundHandler = (_req: Request, res: Response): void => {
  const error = new AppError(ERROR_MESSAGES.NOT_FOUND, ERROR_CODE_KEYS.NOT_FOUND);
  res.status(error.statusCode).send(getHttpErrorResponse(error));
};
