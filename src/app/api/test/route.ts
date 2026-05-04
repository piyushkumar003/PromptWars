import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function POST(req: Request) {
  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      prompt: 'Hello, are you there?',
    });
    return result.toTextStreamResponse();
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
}
