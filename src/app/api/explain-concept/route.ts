import { NextRequest } from 'next/server';
import { z } from 'zod';
import { generateJSON, truncateForTokens } from '@/lib/ai/gemini';
import { buildConceptExplanationPrompt } from '@/lib/ai/prompts';
import { ConceptExplanationSchema } from '@/lib/ai/schemas';

const RequestSchema = z.object({
  concept: z.string().min(1).max(200),
  documentContext: z.string().min(1),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.enum(['english', 'tamil', 'hindi', 'telugu', 'malayalam']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { concept, documentContext, level, language } = parsed.data;

    const prompt = buildConceptExplanationPrompt({
      concept,
      documentContext: truncateForTokens(documentContext, 4000),
      level,
      language,
    });

    const raw = await generateJSON<unknown>(prompt);
    const result = ConceptExplanationSchema.safeParse(raw);

    if (!result.success) {
      return Response.json({ error: 'AI response validation failed', details: result.error.message }, { status: 500 });
    }

    return Response.json(result.data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Concept explanation failed';
    const isApiKeyError = message.includes('GEMINI_API_KEY');
    return Response.json(
      { error: isApiKeyError ? 'Gemini API key not configured.' : message, code: isApiKeyError ? 'API_KEY_MISSING' : 'EXPLAIN_ERROR' },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
