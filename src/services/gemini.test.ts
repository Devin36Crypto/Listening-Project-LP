import { describe, it, expect, vi, beforeAll } from 'vitest';
import { sendChatMessage } from './gemini';

beforeAll(() => {
  vi.stubEnv('GEMINI_API_KEY', 'test-key');
});

vi.mock('@google/genai', () => ({
  GoogleGenAI: class {
    chats = {
      create: vi.fn().mockReturnValue({
        sendMessage: vi.fn().mockResolvedValue({
          text: 'Mocked AI Response'
        })
      })
    };
    constructor() {}
  },
  ThinkingLevel: { HIGH: 'high' },
  Modality: { AUDIO: 'audio' }
}));

describe('gemini service', () => {
  it('should format message history correctly and return response', async () => {
    const history = [{ role: 'user' as const, parts: [{ text: 'Hello' }] }];
    const response = await sendChatMessage('How are you?', history);
    
    expect(response.text).toBe('Mocked AI Response');
  });

  it('should handle thinking mode parameter', async () => {
    const response = await sendChatMessage('Test thinking', [], true);
    expect(response.text).toBe('Mocked AI Response');
  });

  it('should handle empty message and still return a response', async () => {
    const response = await sendChatMessage('', []);
    expect(response.text).toBe('Mocked AI Response');
  });
});
