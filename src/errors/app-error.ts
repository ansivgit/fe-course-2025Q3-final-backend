import { STATUS_BY_ERROR_CODE } from '../constants/index.js';

import type { ErrorCode, ErrorStatusCode } from '../types/index.js';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: ErrorStatusCode;
  public readonly isOperational: boolean;

  constructor(message: string, code: ErrorCode, isOperational = true) {
    super(message);
    this.code = code;
    this.statusCode = STATUS_BY_ERROR_CODE[code];
    this.isOperational = isOperational; // TODO: add logging or remove this
  }
}
