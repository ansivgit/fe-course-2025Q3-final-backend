import { AppError } from '../errors/index.js';

type AppErrorResponse = {
  data: null;
  error: {
    code?: string;
    message: string;
  };
};

export const getHttpErrorResponse = (
  err: Error | AppError | null,
  message?: string,
): AppErrorResponse => {
  if (err instanceof AppError) {
    return {
      data: null,
      error: {
        code: err.code,
        message: err.message,
      },
    };
  }

  return {
    data: null,
    error: {
      message: err instanceof Error ? err.message : (message ?? 'Something went wrong :('),
    },
  };
};
