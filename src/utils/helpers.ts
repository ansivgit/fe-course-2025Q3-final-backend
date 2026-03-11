import { AppError } from '../errors';

type AppErrorResponse = {
  data: null;
  error: {
    errorCode?: string;
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
        errorCode: err.errorCode,
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
