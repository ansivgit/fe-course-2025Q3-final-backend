import tasksData from '../data/tasks.json';
import { DatabaseError, ValidationError } from '../errors';
import { validateTasksData } from '../utils/validation';

import { ERROR_MESSAGES } from '../constants';
import type { Difficulty, Task } from '../types/ai';
import type { SchemaValidationResult } from '../types/error.types';

export class TaskRepository {
  public async getAllTasks(): Promise<Task[]> {
    let rawData: unknown;
    try {
      rawData = await tasksData;
    } catch {
      throw new DatabaseError(ERROR_MESSAGES.DATABASE_ERROR);
    }
    const validationResult: SchemaValidationResult<Task[]> = validateTasksData(rawData);

    if (!validationResult.success) {
      throw new ValidationError(`Database validation failed: ${validationResult.error}`);
    }

    return validationResult.data;
  }

  public async getTasksByParams(topic: string, difficulty: Difficulty): Promise<Task[]> {
    const allTasks: Task[] = await this.getAllTasks();

    return allTasks.filter((task) => task.topic === topic && task.difficulty === difficulty);
  }
}
