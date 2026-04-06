import { STATUS_BY_ERROR_CODE } from '../constants';
import type { ErrorCode, ErrorStatusCode } from '../types';

export class AppError extends Error {
  public readonly errorCode: ErrorCode;
  public readonly statusCode: ErrorStatusCode;
  public readonly isOperational: boolean;

  constructor(message: string, errorCode: ErrorCode, isOperational = true) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = STATUS_BY_ERROR_CODE[errorCode];
    this.isOperational = isOperational; // TODO: add logging or remove this
  }
}
