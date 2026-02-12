import type { Request, Response } from 'express';
import { aiService } from '../services/ai.service.js';

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_INTERNAL_ERROR = 500;

export const chatController = async (request: Request, res: Response): Promise<void> => {
  try {
    const { message } = request.body;

    if (!message) {
      res.status(HTTP_STATUS_BAD_REQUEST).json({ error: 'Field "message" is required' });
      return;
    }

    // Setting the titles for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // We receive a stream from the service
    const stream = aiService.streamChat([{ role: 'user', content: message }]);

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
      res.status(HTTP_STATUS_INTERNAL_ERROR).json({ error: 'Internal AI Error' });
    }
  }
};
