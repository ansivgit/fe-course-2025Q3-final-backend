import tasksData from '../data/tasks.json';
import type { Difficulty, Task } from '../types/ai';
import { validateTasksData } from '../utils/validation';

export class TaskRepository {
  public getTasksByParams(topic: string, difficulty: Difficulty): Task[] {
    const validationResult = validateTasksData(tasksData);

    if (!validationResult.success) {
      throw new Error(`Database validation failed: ${validationResult.error}`);
    }

    const allTasks = validationResult.data;

    return allTasks.filter((task) => task.topic === topic && task.difficulty === difficulty);
  }
}
