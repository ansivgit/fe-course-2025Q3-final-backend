import { STATUS_BY_ERROR_CODE } from '../constants';
import type { ErrorCode, ErrorRes, ErrorStatusCode } from '../types';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: ErrorStatusCode;
  public readonly isOperational: boolean;

  constructor(message: string, code: ErrorCode, isOperational = true) {
    super(message);
    this.code = code;
    this.statusCode = STATUS_BY_ERROR_CODE[code];
    this.isOperational = isOperational;
  }

  public toJSON(): ErrorRes {
    return {
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}
