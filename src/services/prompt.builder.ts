import { SYSTEM_PROMPTS } from '../constants/prompts';
import type { Task } from '../types/ai';

export class PromptBuilderService {
  // A system prompt for an AI agent based on theme and complexity
  public buildJudgeSystemPrompt(task: Task): string {
    const rubricText = task.rubric.map((rule) => `- ${rule}`).join('\n');

    return SYSTEM_PROMPTS.JUDGE_PROMPT(task, rubricText);
  }
}

export const promptBuilder = new PromptBuilderService();
