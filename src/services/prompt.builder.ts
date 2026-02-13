import type { Difficulty } from '../types/ai';

export class PromptBuilderService {
  // A system prompt for an AI agent based on theme and complexity
  public buildInterviewPrompt(topic: string, difficulty: Difficulty): string {
    // We determine the tone and depth of the questions depending on the level
    const difficultyContext = this.getDifficultyContext(difficulty);

    return `
      You are a strict but fair Senior Software Engineer conducting a technical interview.
      The topic of the interview is: "${topic}".
      The candidate is applying for a "${difficulty}" level position.

      ${difficultyContext}

      CRITICAL RULES YOU MUST FOLLOW:
      1. Act as the interviewer. Do not break character.
      2. Ask ONLY ONE question at a time. Never give a list of questions.
      3. Wait for the candidate's answer before proceeding.
      4. After the candidate answers, briefly evaluate it (correct, partially correct, or wrong), 
        explain the mistake if any, and then ask the next question.
      5. Keep your responses concise. No long lectures unless explaining a critical mistake.
      6. Speak in Russian, but keep technical terms in English (e.g., Event Loop, Promise, Closure).
    `.trim();
  }

  // An auxiliary method for detailing complexity level requirements
  private getDifficultyContext(difficulty: Difficulty): string {
    switch (difficulty) {
      case 'junior': {
        return 'Focus on basic concepts, syntax, and fundamental understanding. Be encouraging.';
      }
      case 'middle': {
        return `Focus on real-world application, under-the-hood mechanics, and edge cases. 
          Expect detailed explanations.`;
      }
      case 'senior': {
        return `Focus on system design, performance optimization, architecture, 
          and deep language specifications. Be highly critical.`;
      }
      default: {
        return '';
      }
    }
  }
}

export const promptBuilder = new PromptBuilderService();
