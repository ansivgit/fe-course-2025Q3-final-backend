import tasksData from '../data/tasks.json';
import type { Difficulty, Task } from '../types/ai';
import { isObject } from '../utils/validation.ts';

export class TaskRepository {
  public async getRandomTask(topic: string, difficulty: Difficulty): Promise<Task | undefined> {
    const rawData = await Promise.resolve(tasksData);

    if (!this.isTaskArray(rawData)) {
      throw new Error('Invalid data format in tasks.json');
    }

    const filteredTasks = rawData.filter(
      (task) => task.topic === topic && task.difficulty === difficulty,
    );

    if (filteredTasks.length === 0) {
      return undefined;
    }

    const randomIndex = Math.floor(Math.random() * filteredTasks.length);
    return filteredTasks[randomIndex];
  }

  private isTaskArray(data: unknown): data is Task[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item) => this.isTask(item));
  }

  private isTask(item: unknown): item is Task {
    if (!isObject(item)) {
      return false;
    }

    if (
      typeof item.id !== 'string' ||
      typeof item.topic !== 'string' ||
      typeof item.question !== 'string' ||
      typeof item.goldenAnswer !== 'string'
    ) {
      return false;
    }

    const rubric = item.rubric;
    if (!Array.isArray(rubric) || !rubric.every((r) => typeof r === 'string')) {
      return false;
    }

    const diff = item.difficulty;
    return !(diff !== 'junior' && diff !== 'middle' && diff !== 'senior');
  }
}
