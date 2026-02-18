import Groq from 'groq-sdk';
import type { ChatMessage } from '../types/ai.js';

const MOCK_DELAY_MS = 50;
const MODEL_ID = 'llama-3.3-70b-versatile';
const TEMPERATURE = 0.7;
const MAX_TOKENS = 1024;

export class AiService {
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY ?? 'dummy_key',
    });
  }

  // The main method for getting a response stream
  public streamChat(messages: ChatMessage[]): AsyncIterable<string> {
    const useMock = process.env.USE_MOCK === 'true';

    if (useMock) {
      console.warn('⚠️ [AiService] Using MOCK mode');
      return this.getMockStream();
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('❌ [AiService] No API Key provided');
      throw new Error('GROQ_API_KEY is missing');
    }

    return this.getRealStream(messages);
  }

  // A real request to the Groq API
  private async *getRealStream(messages: ChatMessage[]): AsyncIterable<string> {
    try {
      const stream = await this.client.chat.completions.create({
        messages: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
        model: MODEL_ID,
        stream: true,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content ?? '';
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('Error in Groq stream:', error);
      throw error;
    }
  }

  // Fake stream for development (Mock Mode)
  // Emulates the printing of text in pieces
  private async *getMockStream(): AsyncIterable<string> {
    const mockResponse = `This is a test response in development mode. 
      I'm emulating the work of AI..
      Here is a sample code:
      \`\`\`typescript
      const greeting: string = "Hello World";
      console.log(greeting);
      \`\`\`
    `;

    // We break the text into small pieces of 2-5 characters each, so that it looks like a stream.
    const chunkParams = { min: 1, max: 3 };
    // We break it into small pieces to emulate printing
    const chunks =
      mockResponse.match(
        new RegExp(`.{${String(chunkParams.min)},${String(chunkParams.max)}}`, 'g'),
      ) ?? [];

    for (const chunk of chunks) {
      await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
      yield chunk;
    }
  }
}

// Exporting an instance to use as a singleton
export const aiService = new AiService();
