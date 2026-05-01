import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

// Simple in-memory cache to save tokens and avoid quota limits
const translationCache = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return Response.json({ error: "Missing text or targetLanguage" }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `${targetLanguage}:${text}`;
    if (translationCache.has(cacheKey)) {
      console.log(`Using cached translation for: ${text.substring(0, 20)}...`);
      return Response.json({ translatedText: translationCache.get(cacheKey) });
    }

    console.log(`Translating to ${targetLanguage}: ${text.substring(0, 20)}...`);

    const { text: translatedText } = await generateText({
      model: google('gemini-2.0-flash'),
      system: `You are a professional translator specializing in Indian languages. 
      Your task is to translate the given text into ${targetLanguage}.
      Maintain the tone and meaning perfectly. 
      If the input is a JSON string of steps or facts, return the translated content in the EXACT SAME JSON structure.
      Return ONLY the translated text or JSON, no explanations.`,
      prompt: text,
    });

    // Save to cache
    translationCache.set(cacheKey, translatedText);

    return Response.json({ translatedText });
  } catch (error: any) {
    console.error("Translation error:", error);
    return Response.json({ 
      error: "Translation failed", 
      message: error.message,
      isQuotaError: error.message?.includes('quota') || error.message?.includes('429')
    }, { status: 500 });
  }
}
