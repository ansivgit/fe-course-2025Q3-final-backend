import type { Request, Response } from 'express';
import { aiService } from '../services/ai.service.js';

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_INTERNAL_ERROR = 500;

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a message to the agent and receive a streamed response
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "How does the Event Loop work?"
 *               sessionId:
 *                 type: string
 *                 description: "Session ID"
 *     responses:
 *       200:
 *         description: Streaming response
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server or AI provider error
 */
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
