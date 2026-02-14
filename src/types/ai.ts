import type { Request } from 'express';

export type ChatRole = 'system' | 'user' | 'assistant';
export type Difficulty = 'junior' | 'middle' | 'senior';

export type ChatMessage = {
  role: ChatRole;
  content: string;
}

export type ChatRequest = {
  message: string;
  sessionId?: string;
  topic?: string;
  difficulty?: 'junior' | 'middle' | 'senior';
}

export type ChatResponse = {
  sessionId: string;
  stream: boolean;
}

export type ChatRequestBody = {
  message?: string;
  topic?: string;
  difficulty?: Difficulty;
  sessionId?: string;
}

export type TypedChatRequest = Request<Record<string, never>, unknown, ChatRequestBody>;
