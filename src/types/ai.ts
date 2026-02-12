export type ChatRole = 'system' | 'user' | 'assistant';

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
