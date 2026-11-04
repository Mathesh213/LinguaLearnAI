import { generateJSON, truncateForTokens } from './gemini';
import { buildValidationPrompt } from './prompts';
import { ValidationResponseSchema } from './schemas';
import type { ValidationResult } from '@/types';

async function runValidation(
  original: string,
  generated: string,
  type: 'translation' | 'simplification' | 'quiz'
): Promise<ValidationResult> {
  const prompt = buildValidationPrompt({
    original: truncateForTokens(original, 2000),
    generated: truncateForTokens(generated, 2000),
    type,
  });

  try {
    const response = await generateJSON<ValidationResult>(prompt);
    const parsed = ValidationResponseSchema.safeParse(response);
    if (!parsed.success) {
      return {
        isValid: false,
        score: 0,
        warnings: ['Validation response schema mismatch'],
        errors: [parsed.error.message],
        suggestions: [],
      };
    }
    return parsed.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      isValid: false,
      score: 0,
      warnings: ['Validation could not be completed'],
      errors: [msg],
      suggestions: ['Check your API key and try again'],
    };
  }
}

export async function validateTranslation(
  original: string,
  translated: string
): Promise<ValidationResult> {
  return runValidation(original, translated, 'translation');
}

export async function validateSimplification(
  original: string,
  simplified: string
): Promise<ValidationResult> {
  return runValidation(original, simplified, 'simplification');
}

export async function validateQuizQuestion(
  question: string,
  answer: string,
  sourceContent: string
): Promise<ValidationResult> {
  const combined = `QUESTION: ${question}\nANSWER: ${answer}`;
  return runValidation(sourceContent, combined, 'quiz');
}
