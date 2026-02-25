import { CONSTANTS } from '../constants/constants.ts';

import type { TypedChatRequest } from '../types/ai.ts';

import type { Response } from 'express';
import { aiService, historyService, promptBuilder, taskService } from '../services';
import { validateChatRequest } from '../utils/validation.ts';

export const chatController = async (request: TypedChatRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = validateChatRequest(request.body);

    if (error || !data) {
      res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).send({ data: null, error: error });
      return;
    }

    const { message, topic, difficulty, sessionId } = data;

    if (!message || !topic || !difficulty || !sessionId) {
      res.status(CONSTANTS.HTTP_STATUS_BAD_REQUEST).json({
        error: 'Fields "message", "topic", "difficulty", and "sessionId" are required',
      });
      return;
    }

    // Setting the titles for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Taking out the old story
    const history = historyService.getHistory(sessionId);

    // If the story is empty, this is the beginning of the dialogue. Setting the AI's "personality"
    if (history.length === 0) {
      const task = await taskService.getTaskForSession(topic, difficulty);
      const systemPrompt = promptBuilder.buildJudgeSystemPrompt(task);
      historyService.addMessage(sessionId, { role: 'system', content: systemPrompt });
    }

    // Adding a new message from the user to the history
    historyService.addMessage(sessionId, { role: 'user', content: message });

    // Taking the full story to send to AI
    const messagesToSend = historyService.getHistory(sessionId);
    const stream = aiService.streamChat(messagesToSend);

    let assistantFullResponse = '';

    // We read the stream and write back in real time
    for await (const chunk of stream) {
      res.write(chunk);
      assistantFullResponse += chunk;
    }

    // Saving the complete AI response to the session history
    historyService.addMessage(sessionId, { role: 'assistant', content: assistantFullResponse });

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
