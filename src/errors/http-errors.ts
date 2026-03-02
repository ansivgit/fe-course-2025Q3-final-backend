import { AppError } from './app-error';

import { ERROR_CODE_KEYS, ERROR_MESSAGES } from '../constants';

export class BadRequestError extends AppError {
  constructor(message = ERROR_MESSAGES.BAD_REQUEST) {
    super(message, ERROR_CODE_KEYS.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, ERROR_CODE_KEYS.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = ERROR_MESSAGES.FORBIDDEN) {
    super(message, ERROR_CODE_KEYS.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = ERROR_MESSAGES.NOT_FOUND) {
    super(message, ERROR_CODE_KEYS.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message = ERROR_MESSAGES.CONFLICT) {
    super(message, ERROR_CODE_KEYS.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(message = ERROR_MESSAGES.VALIDATION_ERROR) {
    super(message, ERROR_CODE_KEYS.VALIDATION_ERROR);
  }
}

export class InternalError extends AppError {
  constructor(message = ERROR_MESSAGES.INTERNAL_ERROR) {
    super(message, ERROR_CODE_KEYS.INTERNAL_ERROR);
  }
}

export class DatabaseError extends AppError {
  constructor(message = ERROR_MESSAGES.DATABASE_ERROR) {
    super(message, ERROR_CODE_KEYS.DATABASE_ERROR);
  }
}
