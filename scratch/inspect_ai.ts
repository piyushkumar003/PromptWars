import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';

dotenv.config();

async function inspect() {
  const result = streamText({
    model: google('gemini-2.0-flash'),
    prompt: 'Hello',
  });
  console.log('Keys of streamText result:', Object.keys(result));
  // @ts-ignore
  console.log('Prototype keys:', Object.keys(Object.getPrototypeOf(result)));
}

inspect();
