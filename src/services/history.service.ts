import type { ChatMessage } from '../types/ai';

const sessionStore = new Map<string, ChatMessage[]>();

export const historyService = {
  // Get the history of correspondence by session ID
  // If there is no session, returns an empty array.
  getHistory(sessionId: string): ChatMessage[] {
    const history = sessionStore.get(sessionId);
    return history ?? [];
  },

  // Add one message to the end of the history of a specific session
  addMessage(sessionId: string, message: ChatMessage): void {
    const history = this.getHistory(sessionId);
    history.push(message);
    sessionStore.set(sessionId, history);
  },

  // Clear the history
  clearHistory(sessionId: string): void {
    sessionStore.delete(sessionId);
  },
};
