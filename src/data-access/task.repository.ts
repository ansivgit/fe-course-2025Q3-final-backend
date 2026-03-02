import tasksData from '../data/tasks.json';
import type { Difficulty, Task } from '../types/ai';
import { TasksArraySchema } from '../utils/validation';

export class TaskRepository {
  public getTasksByParams(topic: string, difficulty: Difficulty): Task[] {
    const allTasks = TasksArraySchema.parse(tasksData);

    return allTasks.filter((task) => task.topic === topic && task.difficulty === difficulty);
  }
}
