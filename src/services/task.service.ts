import { TaskRepository } from '../data-access';
import { NotFoundError } from '../errors/http-errors.js';
import type { Difficulty, Task } from '../types/ai.js';
import { getRandomElement } from '../utils/getRandomElement.js';

export class TaskService {
  private readonly taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  public async getTask(topic: string, difficulty: Difficulty): Promise<Task> {
    const tasks: Task[] = await this.taskRepository.getTasksByParams(topic, difficulty);

    if (!Array.isArray(tasks) || tasks.length === 0) {
      throw new NotFoundError(`Tasks not found for topic: "${topic}" and difficulty: "${difficulty}"`);
    }

    const task: Task = getRandomElement(tasks);

    return task;
  }
}

export const taskService = new TaskService();
