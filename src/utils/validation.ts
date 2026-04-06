import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { type ZodType, z } from 'zod';

import { DatabaseError, ValidationError } from '../errors';
import {
  type ChatRequestParams,
  ChatRequestSchema,
  ProgressSchema,
  TasksArraySchema,
  UserSchema,
  type WidgetValidation,
} from '../schemas';

import type { ProgressData, SchemaValidationResult, Task, User } from '../types';

// An auxiliary function that verifies that the value is an object
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const validateChatRequest = (data: unknown): SchemaValidationResult<ChatRequestParams> => {
  const parsed = ChatRequestSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((er) => er.message).join(', '),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
};

export const validateTasksData = (data: unknown): SchemaValidationResult<Task[]> => {
  const parsed = TasksArraySchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((er) => er.message).join(', '),
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
};

// Validation of widget data
export function validateWidgets<T>(data: unknown, schema: ZodType<T>): WidgetValidation<T> {
  const result: z.ZodSafeParseResult<T[]> = z.array(schema).safeParse(data);

  if (!result.success) {
    throw new DatabaseError(
      result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '),
    );
  }

  return result.data;
}

// Validation of data for seeding users
export function userSeedValidation(data: unknown): Omit<User, '_id'> {
  const result = UserSchema.safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    throw new ValidationError(
      result.error.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; '),
    );
  }
}

// Validation of users' name when User update
export function userNameValidation(data: unknown): Pick<User, 'name'> {
  const result = UserSchema.pick({ name: true }).safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    throw new ValidationError(
      result.error.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; '),
    );
  }
}

export function userProgressValidation(data: unknown): Partial<ProgressData> {
  const result = ProgressSchema.partial().safeParse(data);

  if (result.success) {
    return result.data;
  } else {
    throw new ValidationError(
      result.error.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; '),
    );
  }
}

// Validation of request body in request handler
export function requestValidation(schema: ZodType): RequestHandler {
  return (req: Request, _: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(
          error.issues.map((issue) => `${issue.path}: ${issue.message}`).join('; '),
        );
      } else {
        next(error);
      }
    }
  };
}
