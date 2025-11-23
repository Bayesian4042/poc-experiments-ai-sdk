import { openai } from '@ai-sdk/openai';
import { experimental_generateSpeech as generateSpeech } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response('Text is required', { status: 400 });
    }

    const result = await generateSpeech({
      model: openai.speech('gpt-4o-mini-tts'),
      text: text,
      voice: 'alloy',
    });

    const audioBase64 = result.audio.base64;
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('TTS Error:', error);
    return new Response('Failed to generate speech', { status: 500 });
  }
}

