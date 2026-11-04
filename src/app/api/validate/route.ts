import { NextRequest } from 'next/server';
import { z } from 'zod';
import { validateTranslation, validateSimplification, validateQuizQuestion } from '@/lib/ai/validation';

const RequestSchema = z.object({
  type: z.enum(['translation', 'simplification', 'quiz']),
  original: z.string().min(1),
  generated: z.string().min(1),
  answer: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { type, original, generated, answer } = parsed.data;
    let result;

    if (type === 'translation') {
      result = await validateTranslation(original, generated);
    } else if (type === 'simplification') {
      result = await validateSimplification(original, generated);
    } else {
      result = await validateQuizQuestion(generated, answer ?? '', original);
    }

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Validation failed';
    return Response.json({ error: message }, { status: 500 });
  }
}
