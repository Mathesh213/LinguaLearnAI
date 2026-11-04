import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateQuiz } from '@/lib/ai/quiz-generation';

const RequestSchema = z.object({
  documentId: z.string().min(1),
  sections: z.array(z.object({ id: z.string(), title: z.string(), content: z.string(), order: z.number() })).min(1).max(50),
  topicNames: z.array(z.string()).min(1),
  questionCount: z.number().min(1).max(20),
  difficulty: z.enum(['easy', 'moderate', 'difficult']),
  language: z.enum(['english', 'tamil', 'hindi', 'telugu', 'malayalam']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  questionTypes: z.array(z.enum(['mcq', 'fill-blank', 'short-answer'])).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }
    const quiz = await generateQuiz(parsed.data);
    return Response.json(quiz);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Quiz generation failed';
    const isApiKeyError = message.includes('GEMINI_API_KEY');
    return Response.json(
      { error: isApiKeyError ? 'Gemini API key not configured.' : message, code: isApiKeyError ? 'API_KEY_MISSING' : 'QUIZ_ERROR' },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
