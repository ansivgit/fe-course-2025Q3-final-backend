import { TaskRepository } from '../data-access';
import type { Difficulty, Task } from '../types/ai.js';
import { getRandomElement } from '../utils/random';

export class TaskService {
  private readonly taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  public getTaskForSession(topic: string, difficulty: Difficulty): Task {
    const tasks = this.taskRepository.getTasksByParams(topic, difficulty);

    if (tasks.length === 0) {
      throw new Error(`Tasks not found for topic: "${topic}" and difficulty: "${difficulty}"`);
    }

    const task = getRandomElement(tasks);

    if (!task) {
      throw new Error('Failed to pick a random task');
    }

    return task;
  }
}

export const taskService = new TaskService();
