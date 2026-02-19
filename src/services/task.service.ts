import { TaskRepository } from '../data-access';
import type { Difficulty, Task } from '../types/ai.js';

export class TaskService {
  private readonly taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  public async getTaskForSession(topic: string, difficulty: Difficulty): Promise<Task> {
    const task = await this.taskRepository.getRandomTask(topic, difficulty);

    if (!task) {
      throw new Error(`Tasks not found for topic: "${topic}" and difficulty: "${difficulty}"`);
    }

    return task;
  }
}

export const taskService = new TaskService();
