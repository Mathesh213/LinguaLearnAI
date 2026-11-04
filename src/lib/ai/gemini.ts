import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerationConfig,
} from '@google/generative-ai';

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000;

/**
 * Default Flash model: gemini-3.6-flash
 *
 * gemini-1.5-flash is retired (404 NOT_FOUND).
 * gemini-3.8-flash is listed for this API with generateContent, but it currently
 * returns 503 high-demand; gemini-3.6-flash is the newest stable Flash model
 * that actually serves generateContent. Override with GEMINI_MODEL (server-side).
 */
export const FALLBACK_MODEL = 'gemini-3.6-flash';

function stripModelsPrefix(name: string): string {
  return name.replace(/^models\//, '').trim();
}

/**
 * Resolves the Gemini model used by every AI route.
 * Reads GEMINI_MODEL on each call so Next.js env updates are picked up.
 * Never reads NEXT_PUBLIC_* — the key and model stay on the server.
 */
export function getConfiguredModel(): string {
  const fromEnv = process.env.GEMINI_MODEL?.trim();
  if (fromEnv) return stripModelsPrefix(fromEnv);
  return FALLBACK_MODEL;
}

/** Snapshot of the configured model at module load (same source as getConfiguredModel). */
export const DEFAULT_MODEL = getConfiguredModel();

// ── Singleton Client ───────────────────────────────────────────────────────────
let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY is not configured. Add it to frontend/.env.local:\n' +
        '  GEMINI_API_KEY=your_key_here\n' +
        'Get a free key at https://aistudio.google.com/app/apikey'
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// ── Model Factory ─────────────────────────────────────────────────────────────
/**
 * Returns a configured GenerativeModel.
 * @param modelName - Gemini model identifier. Defaults to GEMINI_MODEL / gemini-3.6-flash.
 * @param config    - Optional GenerationConfig overrides.
 */
export function getModel(
  modelName: string = getConfiguredModel(),
  config?: GenerationConfig
): GenerativeModel {
  const client = getClient();
  const model = stripModelsPrefix(modelName || getConfiguredModel());
  return client.getGenerativeModel(
    {
      model,
      generationConfig: config,
    },
    {
      // Deprecated SDK still defaults to v1beta; current Flash models are available there.
      apiVersion: 'v1beta',
    }
  );
}

// ── Retry Helper ──────────────────────────────────────────────────────────────
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(message: string): boolean {
  return (
    message.includes('503') ||
    message.includes('429') ||
    message.includes('UNAVAILABLE') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('high demand')
  );
}

export async function generateWithRetry(
  prompt: string,
  config?: GenerationConfig,
  modelName: string = getConfiguredModel()
): Promise<string> {
  const resolvedModel = stripModelsPrefix(modelName || getConfiguredModel());
  const model = getModel(resolvedModel, config);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      console.error(
        `[Gemini] generateContent attempt ${attempt + 1}/${MAX_RETRIES} failed ` +
        `(model: ${resolvedModel}): ${lastError.message}`
      );

      if (!isRetryableError(lastError.message) || attempt === MAX_RETRIES - 1) {
        break;
      }
      await delay(RETRY_DELAY_MS * Math.pow(2, attempt));
    }
  }

  const detail = lastError?.message ?? 'unknown error';
  throw new Error(
    `Failed to generate content with ${resolvedModel}: ${detail}`
  );
}

// ── JSON Generator ────────────────────────────────────────────────────────────
export async function generateJSON<T>(
  prompt: string,
  config?: GenerationConfig
): Promise<T> {
  const jsonConfig: GenerationConfig = {
    responseMimeType: 'application/json',
    ...config,
  };

  const rawText = await generateWithRetry(prompt, jsonConfig);

  // Strip markdown code fences if present
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    // Try to extract JSON object or array from the response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error(`Failed to parse AI response as JSON: ${cleaned.slice(0, 200)}`);
  }
}

// ── Token / Content Limits ────────────────────────────────────────────────────
export const TOKEN_LIMITS = {
  translation: 12000,   // chars (≈ 3000 tokens)
  simplification: 10000,
  topicAnalysis: 14000,
  quizGeneration: 10000,
  conceptExplanation: 5000,
  validation: 6000,
} as const;

export function truncateForTokens(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + '\n\n[Content truncated for processing...]';
}

// ── Chunk splitter ────────────────────────────────────────────────────────────
export function splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}
