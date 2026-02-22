import type { ChatMessage, GroqResponse } from '../types/ai.js';
import { isObject } from '../utils/validation.ts';

const MOCK_DELAY_MS = 50;
const MODEL_ID = 'llama-3.3-70b-versatile';
const TEMPERATURE = 0.7;
const MAX_TOKENS = 1024;
const DATA_PREFIX = 'data: ';
const DONE_MARKER = '[DONE]';

export class AiService {
  private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly apiKey = process.env.GROQ_API_KEY ?? '';

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
      const response = await this.performRequest(messages);

      if (!response.body) {
        throw new Error('Response body is empty');
      }

      const reader: ReadableStreamDefaultReader<Uint8Array> = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      // We read the stream in chunks until done becomes true
      let { done, value } = await reader.read();

      while (!done) {
        const chunk = decoder.decode(value, { stream: true });
        const { lines, remaining } = this.updateBuffer(buffer, chunk);
        buffer = remaining;

        // Processing each full line from the buffer
        for (const line of lines) {
          const content = this.parseLine(line);
          if (content) {
            yield content;
          }
        }

        const result = await reader.read();
        done = result.done;
        value = result.value;
      }
    } catch (error) {
      console.error('Error accessing the AI API:', error);
      throw new Error("Couldn't get a response from the AI. Check the connection or server logs.");
    }
  }

  // Executes a network request to the Groq API via native fetch
  // adjusts the request headers and body to enable streaming mode
  private async performRequest(messages: ChatMessage[]): Promise<Response> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_ID,
          messages: messages.map((message) => ({ role: message.role, content: message.content })),
          stream: true,
          temperature: TEMPERATURE,
          max_tokens: MAX_TOKENS,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API Error: ${String(response.status)} - ${errorText}`);
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error when accessing AI:', error.message);
        throw new Error(`Couldn't get a response from AI: ${error.message}`);
      }
      console.error('Unknown error during fetch:', error);
      throw new Error('An unexpected network error has occurred');
    }
  }

  // Manages the buffer of incomplete lines
  // Finds all completed lines (separated by \n) and saves the remainder for the next chunk
  private updateBuffer(
    currentBuffer: string,
    chunk: string,
  ): { lines: string[]; remaining: string } {
    const combined = currentBuffer + chunk;
    const lines = combined.split('\n');
    const remaining = lines.pop() ?? '';
    return { lines, remaining };
  }

  // Parses a single line in the Server-Sent Events format
  // Cuts off the 'data:' prefix, checks the completion marker, and parses the JSON
  private parseLine(line: string): string | null {
    const trimmed = line.trim();
    if (!trimmed.startsWith(DATA_PREFIX)) {
      return null;
    }

    const dataString = trimmed.slice(DATA_PREFIX.length);
    if (dataString === DONE_MARKER) {
      return null;
    }

    try {
      const json: unknown = JSON.parse(dataString);

      if (this.isGroqResponse(json)) {
        return json.choices[0]?.delta.content ?? null;
      }
      return null;
    } catch (error) {
      console.error('Error parsing JSON chunk', error);
      return null;
    }
  }

  // The Type validator (Type Guard) for the Groq response
  private isGroqResponse(data: unknown): data is GroqResponse {
    if (!isObject(data)) {
      return false;
    }

    const choices = data.choices;
    if (!Array.isArray(choices) || choices.length === 0) {
      return false;
    }

    const firstChoice = choices[0];
    if (!isObject(firstChoice)) {
      return false;
    }

    return isObject(firstChoice.delta);
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
