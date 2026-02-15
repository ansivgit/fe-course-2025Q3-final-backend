import { TOPICS, DIFFICULTIES } from '../constants/dictionaries';
import type { ChatRequestBody, Difficulty } from '../types/ai';


type ValidationResult =
  | { success: true; data: ChatRequestBody }
  | { success: false; error: string };

// An auxiliary function that verifies that the value is an object
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Checks that the string is of acceptable difficulty level
function isValidDifficulty(value: string): value is Difficulty {
  return DIFFICULTIES.some((item) => item.id === value);
}

// Checks that the string is a valid topic.
function isValidTopic(value: string): boolean {
  return TOPICS.some((item) => item.id === value);
}

export const validateChatRequest = (body: unknown): ValidationResult => {
  if (!isRecord(body)) {
    return { success: false, error: 'Request body must be a JSON object' };
  }

  const { message, topic, difficulty, sessionId } = body;

  // Validation of fields
  if (typeof message !== 'string' || !message.trim()) {
    return { success: false, error: 'Field "message" is required and must be a non-empty string' };
  }

  if (typeof sessionId !== 'string' || !sessionId.trim()) {
    return { success: false, error: 'Field "sessionId" is required' };
  }

  if (typeof topic !== 'string' || !isValidTopic(topic)) {
    // We collect available topics for suggestions in the error
    const allowed = TOPICS.map((t) => t.id).join(', ');
    return { success: false, error: `Invalid or missing "topic". Allowed: ${allowed}` };
  }

  if (typeof difficulty !== 'string' || !isValidDifficulty(difficulty)) {
    const allowed = DIFFICULTIES.map((d) => d.id).join(', ');
    return { success: false, error: `Invalid or missing "difficulty". Allowed: ${allowed}` };
  }

  return {
    success: true,
    data: {
      message,
      topic,
      difficulty,
      sessionId,
    },
  };
};