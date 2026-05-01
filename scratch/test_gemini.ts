import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  try {
    const { text } = await generateText({
      model: google('gemini-3.1-flash-lite-preview'),
      prompt: 'Hello',
    });
    console.log('Response:', text);
  } catch (err: any) {
    console.error('Error:', err.message);
    if (err.data) {
      console.error('Data:', JSON.stringify(err.data, null, 2));
    }
  }
}

test();
