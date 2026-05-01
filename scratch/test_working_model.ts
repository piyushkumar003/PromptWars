import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import dotenv from 'dotenv';

dotenv.config();

async function testModel(modelName: string) {
  console.log(`Testing model: ${modelName}...`);
  try {
    const { text } = await generateText({
      model: google(modelName),
      prompt: 'Say "Hello, I am working!"',
    });
    console.log(`Result for ${modelName}: ${text}`);
    return true;
  } catch (err: any) {
    console.error(`Error for ${modelName}:`, err.message);
    if (err.data) {
        console.error('Error data:', JSON.stringify(err.data, null, 2));
    }
    return false;
  }
}

async function runTests() {
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash', 'gemini-flash-latest'];
  for (const model of models) {
    const success = await testModel(model);
    if (success) {
        console.log(`SUCCESS: ${model} is working!`);
        break;
    }
  }
}

runTests();
