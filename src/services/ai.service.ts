import { AiRepository } from '../data-access';

import type { ChatMessage } from '../types';

export class AiService {
  private readonly aiRepository: AiRepository;

  constructor() {
    this.aiRepository = new AiRepository();
  }

  // The main method for getting a response stream
  public streamChat(messages: ChatMessage[]): AsyncIterable<string> {
    return this.aiRepository.getStream(messages);
  }
}

// Exporting an instance to use as a singleton
export const aiService = new AiService();
