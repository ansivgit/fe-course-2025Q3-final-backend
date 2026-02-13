import type { Response } from 'express';
import { aiService } from '../services/ai.service.js';
import { CONSTANTS } from '../constants/constants.ts';
import type { ChatMessage, TypedChatRequest } from '../types/ai.ts';
import { promptBuilder } from '../services/prompt.builder.ts';

export const chatController = async (request: TypedChatRequest, res: Response): Promise<void> => {
  try {
    const { message, topic, difficulty } = request.body;

    if (!message || !topic || !difficulty) {
      res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json({ 
        error: 'Fields "message", "topic", and "difficulty" are required',
      });
      return;
    }

    // Setting the titles for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const systemPrompt = promptBuilder.buildInterviewPrompt(topic, difficulty);

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ];

    // We receive a stream from the service
    const stream = aiService.streamChat(messages);

    // We read the stream and write back in real time
    for await (const chunk of stream) {
      res.write(chunk);
    }

    // We finish the response when the stream is over.
    res.end();

  } catch (error) {
    console.error('Chat Controller Error:', error);
    // If we haven't started writing a response yet, we are sending JSON with an error.
    if (res.headersSent) {
      // If the stream has already started, just cut it off.
      res.end();
    } else {
      res.status(CONSTANTS.HTTP_STATUS_INTERNAL_ERROR).json({ error: 'Internal AI Error' });
    }
  }
};
