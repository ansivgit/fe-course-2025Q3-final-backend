import type { ERROR_CODE_KEYS } from '../constants';

export type ErrorCode = (typeof ERROR_CODE_KEYS)[keyof typeof ERROR_CODE_KEYS];

export type ErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 500;

export type ErrorRes = {
  error: {
    code?: ErrorCode;
    message: string;
  };
};

export type ValidationResult<T> = { success: true; data: T } | { success: false; error: string };
