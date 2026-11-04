import { NextRequest } from 'next/server';
import { z } from 'zod';
import { simplifyDocument } from '@/lib/ai/simplification';

const RequestSchema = z.object({
  documentId: z.string().min(1),
  sections: z.array(z.object({ id: z.string(), title: z.string(), content: z.string(), order: z.number() })).min(1).max(50),
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
    const result = await simplifyDocument(parsed.data);
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Simplification failed';
    const isApiKeyError = message.includes('GEMINI_API_KEY');
    return Response.json(
      { error: isApiKeyError ? 'Gemini API key not configured.' : message, code: isApiKeyError ? 'API_KEY_MISSING' : 'SIMPLIFY_ERROR' },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
