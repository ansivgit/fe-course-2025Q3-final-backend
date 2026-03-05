import tasksData from '../data/tasks.json';
import type { Difficulty, Task } from '../types/ai';
import { validateTasksData } from '../utils/validation';

export class TaskRepository {
  public async getTasksByParams(topic: string, difficulty: Difficulty): Promise<Task[]> {
    try {
      const rawData = await tasksData;

      // 2. Валидируем данные
      const validationResult = validateTasksData(rawData);

      if (!validationResult.success) {
        throw new Error(`Database validation failed: ${validationResult.error}`);
      }

      const allTasks = validationResult.data;
      const filteredTasks = allTasks.filter(
        (task) => task.topic === topic && task.difficulty === difficulty,
      );

      return filteredTasks;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
      throw new Error(`Database query failed: ${errorMessage}`);
    }
  }
}
