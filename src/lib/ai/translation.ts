import { generateJSON, truncateForTokens, splitIntoBatches, TOKEN_LIMITS } from './gemini';
import { buildTranslationPrompt } from './prompts';
import { TranslationResponseSchema, type TranslationResponse } from './schemas';
import type { DocumentSection, Translation, Language, TranslatedSection, GlossaryEntry } from '@/types';

export async function translateDocument(params: {
  documentId: string;
  sections: DocumentSection[];
  targetLanguage: Language;
}): Promise<Translation> {
  const { documentId, sections, targetLanguage } = params;

  // Build a short document context
  const documentContext = sections
    .slice(0, 2)
    .map((s) => s.title)
    .join(', ');

  // Process in batches of 4 sections to stay within token limits
  const batches = splitIntoBatches(sections, 4);
  const allTranslatedSections: TranslatedSection[] = [];
  const allGlossaryEntries: GlossaryEntry[] = [];
  const allWarnings: string[] = [];
  const glossaryTermsSeen = new Set<string>();

  for (const batch of batches) {
    const truncatedBatch = batch.map((s) => ({
      id: s.id,
      title: s.title,
      content: truncateForTokens(s.content, 2500),
    }));

    const prompt = buildTranslationPrompt({
      sections: truncatedBatch,
      targetLanguage,
      documentContext,
    });

    let response: TranslationResponse;
    try {
      response = await generateJSON<TranslationResponse>(prompt);
      // Validate with Zod
      const parsed = TranslationResponseSchema.safeParse(response);
      if (!parsed.success) {
        throw new Error(`Schema validation failed: ${parsed.error.message}`);
      }
      response = parsed.data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Translation failed for batch: ${msg}`);
    }

    allTranslatedSections.push(...response.sections);

    // Deduplicate glossary entries
    for (const entry of response.glossary) {
      if (!glossaryTermsSeen.has(entry.term.toLowerCase())) {
        glossaryTermsSeen.add(entry.term.toLowerCase());
        allGlossaryEntries.push(entry);
      }
    }

    allWarnings.push(...response.warnings);
  }

  return {
    id: `trans-${documentId}-${targetLanguage}-${Date.now()}`,
    documentId,
    language: targetLanguage,
    sections: allTranslatedSections,
    glossary: allGlossaryEntries,
    createdAt: new Date(),
    warnings: allWarnings,
    isDemo: false,
  };
}
