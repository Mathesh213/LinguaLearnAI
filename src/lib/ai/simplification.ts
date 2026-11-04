import { generateJSON, truncateForTokens, splitIntoBatches } from './gemini';
import { buildSimplificationPrompt } from './prompts';
import { SimplificationResponseSchema, type SimplificationResponse } from './schemas';
import type { DocumentSection, SimplifiedContent, SimplifiedSection, LearningLevel, Language } from '@/types';

export async function simplifyDocument(params: {
  documentId: string;
  sections: DocumentSection[];
  level: LearningLevel;
  language: Language;
}): Promise<SimplifiedContent> {
  const { documentId, sections, level, language } = params;

  const batches = splitIntoBatches(sections, 3);
  const allSimplifiedSections: SimplifiedSection[] = [];
  const allWarnings: string[] = [];
  let totalCoverage = 0;
  let coverageCount = 0;

  for (const batch of batches) {
    const truncatedBatch = batch.map((s) => ({
      id: s.id,
      title: s.title,
      content: truncateForTokens(s.content, 2000),
    }));

    const prompt = buildSimplificationPrompt({
      sections: truncatedBatch,
      level,
      language,
    });

    let response: SimplificationResponse;
    try {
      response = await generateJSON<SimplificationResponse>(prompt);
      const parsed = SimplificationResponseSchema.safeParse(response);
      if (!parsed.success) {
        throw new Error(`Schema validation: ${parsed.error.message}`);
      }
      response = parsed.data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Simplification failed for batch: ${msg}`);
    }

    allSimplifiedSections.push(...response.sections);
    allWarnings.push(...response.warnings);
    totalCoverage += response.conceptCoverage;
    coverageCount++;
  }

  const avgCoverage = coverageCount > 0 ? Math.round(totalCoverage / coverageCount) : 0;

  return {
    id: `simp-${documentId}-${level}-${Date.now()}`,
    documentId,
    level,
    language,
    sections: allSimplifiedSections,
    createdAt: new Date(),
    conceptCoverage: avgCoverage,
    warnings: allWarnings,
    isDemo: false,
  };
}
