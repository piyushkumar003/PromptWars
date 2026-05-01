import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { prisma } from '@/lib/prisma';
// import { Logging } from '@google-cloud/logging';

// const logging = new Logging();
// const log = logging.log('chat-requests');

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const url = new URL(req.url);
  const userId = req.headers.get('x-user-id') || body.userId || url.searchParams.get('userId');
  const conversationId = req.headers.get('x-conversation-id') || body.conversationId || url.searchParams.get('conversationId');
  const language = body.language || 'en';


/*
  // Log request to Google Cloud Logging
  const metadata = {
    resource: { type: 'cloud_run_revision' },
    severity: 'INFO',
  };
  const entry = log.entry(metadata, { 
    message: "Incoming chat request", 
    userId, 
    conversationId,
    timestamp: new Date().toISOString()
  });
  log.write(entry).catch(console.error);
*/

  console.log(`[API/Chat] Request: userId=${userId}, conversationId=${conversationId}, language=${language}`);

  if (!userId || !conversationId) {
    return new Response('Missing userId or conversationId', { status: 400 });
  }

  // Ensure user exists
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  // Ensure conversation exists
  await prisma.conversation.upsert({
    where: { id: conversationId },
    update: {},
    create: { id: conversationId, userId },
  });

  // Extract new message
  let newMessage = body;
  if (body.messages && body.messages.length > 0) {
    newMessage = body.messages[body.messages.length - 1];
  }

  // Save the latest user message
  if (newMessage && (newMessage.role === 'user' || newMessage.text || newMessage.content || newMessage.parts)) {
    const textContent = newMessage.parts?.[0]?.text || newMessage.content || newMessage.text || '';
    await prisma.message.create({
      data: {
        conversationId,
        role: 'user',
        content: textContent,
      },
    });
  }

  // Fetch full conversation history from database
  const dbMessages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
  });

  const fullMessages = dbMessages.map(msg => ({
    role: (msg.role === 'bot' ? 'assistant' : msg.role) as "user" | "assistant" | "system",
    content: msg.content,
    // In AI SDK 6, parts are preferred but content is still supported.
    // However, we'll keep it as content for now as it matches CoreMessage.
  }));

  const systemPrompt = `You are an accessible, friendly, and simple-to-understand guide for first-time and rural voters in India. 
Your goal is to simplify complex government and election information into actionable, step-by-step guidance.
Be encouraging, use simple language, and avoid jargon. Keep responses concise and focused on the user's specific question.
Use markdown to format your responses. Use **bold text** to highlight important keywords or steps, but avoid overusing asterisks or formatting unnecessarily.

LANGUAGE REQUIREMENT:
The user's preferred language is: ${language === 'hi' ? 'HINDI' : 'ENGLISH'}.
You MUST respond in this language. Even if the user asks in another language, respond in ${language === 'hi' ? 'HINDI' : 'ENGLISH'}.
If the language is HINDI, ensure you use simple, common Hindi words that a rural voter would understand.

CRITICAL GUARDRAILS - YOU MUST FOLLOW THESE RULES AT ALL TIMES:
1. STRICT POLITICAL NEUTRALITY: You must remain 100% strictly non-partisan. Never endorse, criticize, or express opinions about any political party, candidate, politician, or government policy.
2. SCOPE RESTRICTION: Your sole purpose is to help users with the voting process in India (registration, finding polling booths, required documents, EVM instructions, etc.). If a user asks a question completely unrelated to voting, elections, or civic duties, you must politely decline to answer and guide them back to the topic of voting.
3. FACTUAL ACCURACY: Do not hallucinate procedures. Always recommend verifying critical dates and requirements on the official Election Commission of India (ECI) website or voter portal.
4. NO HATE SPEECH OR HARASSMENT: Refuse to engage with any prompts that contain hate speech, discriminatory language, or harassment, and respond with a neutral refusal.
5. NO PREDICTIONS: Never attempt to predict election outcomes or discuss opinion polls.`;

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: systemPrompt,
    messages: fullMessages,
    async onFinish({ text }: { text: string }) {
      await prisma.message.create({
        data: {
          conversationId,
          role: 'bot',
          content: text,
        },
      });
    },
  } as any);
  console.log(`[API/Chat] Stream started for ${conversationId}`);
  return result.toUIMessageStreamResponse();
}
