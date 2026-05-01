import { google } from '@ai-sdk/google';
import dotenv from 'dotenv';

dotenv.config();

// Note: @ai-sdk/google doesn't directly expose a listModels method easily without the provider instance.
// But we can try to use the raw API if needed.
// However, let's try gemini-2.0-flash-exp or gemini-1.5-pro.

async function testPro() {
  try {
    const { google } = await import('@ai-sdk/google');
    const { generateText } = await import('ai');
    
    console.log("Trying gemini-1.5-pro...");
    const resPro = await generateText({
      model: google('gemini-1.5-pro'),
      prompt: 'Hello',
    });
    console.log('Response Pro:', resPro.text);
  } catch (err: any) {
    console.error('Error Pro:', err.message);
  }

  try {
    const { google } = await import('@ai-sdk/google');
    const { generateText } = await import('ai');
    
    console.log("Trying gemini-2.0-flash...");
    const resFlash2 = await generateText({
      model: google('gemini-2.0-flash'),
      prompt: 'Hello',
    });
    console.log('Response Flash 2:', resFlash2.text);
  } catch (err: any) {
    console.error('Error Flash 2:', err.message);
  }
}

testPro();
