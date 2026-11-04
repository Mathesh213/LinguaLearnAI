import { NextRequest } from 'next/server';
import { z } from 'zod';
import { translateDocument } from '@/lib/ai/translation';

const RequestSchema = z.object({
  documentId: z.string().min(1),
  sections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      content: z.string(),
      order: z.number(),
    })
  ).min(1).max(50),
  targetLanguage: z.enum(['tamil', 'hindi', 'telugu', 'malayalam', 'english']),
});

export async function POST(request: NextRequest) {
  try {
    // Request size guard (50KB limit)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 50000) {
      return Response.json({ error: 'Request too large. Max 50KB.' }, { status: 413 });
    }

    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { documentId, sections, targetLanguage } = parsed.data;

    const result = await translateDocument({
      documentId,
      sections: sections.map((s) => ({
        ...s,
        pageNumber: undefined,
        content: s.content,
      })),
      targetLanguage,
    });

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Translation failed';
    const isApiKeyError = message.includes('API_KEY') || message.includes('GEMINI_API_KEY');

    return Response.json(
      {
        error: isApiKeyError
          ? 'Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file.'
          : message,
        code: isApiKeyError ? 'API_KEY_MISSING' : 'TRANSLATION_ERROR',
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
