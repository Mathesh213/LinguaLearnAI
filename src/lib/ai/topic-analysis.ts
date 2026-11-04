import { generateJSON, truncateForTokens, TOKEN_LIMITS } from './gemini';
import { buildTopicAnalysisPrompt } from './prompts';
import { TopicAnalysisResponseSchema, type TopicAnalysisResponse } from './schemas';
import type { DocumentSection, Topic } from '@/types';

export async function analyzeTopics(params: {
  documentId: string;
  sections: DocumentSection[];
  documentTitle: string;
}): Promise<Topic[]> {
  const { documentId, sections, documentTitle } = params;

  // Condense document content for analysis
  const documentContent = truncateForTokens(
    sections
      .map((s) => `## ${s.title}\n${s.content}`)
      .join('\n\n'),
    TOKEN_LIMITS.topicAnalysis
  );

  const prompt = buildTopicAnalysisPrompt({ documentContent, documentTitle });

  let response: TopicAnalysisResponse;
  try {
    response = await generateJSON<TopicAnalysisResponse>(prompt);
    const parsed = TopicAnalysisResponseSchema.safeParse(response);
    if (!parsed.success) {
      throw new Error(`Schema validation: ${parsed.error.message}`);
    }
    response = parsed.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Topic analysis failed: ${msg}`);
  }

  return response.topics.map((t, idx) => ({
    id: `topic-${documentId}-${idx}-${Date.now()}`,
    documentId,
    name: t.name,
    description: t.description,
    difficultyScore: t.difficultyScore,
    difficultyCategory: t.difficultyCategory,
    prerequisites: t.prerequisites,
    subtopics: t.subtopics,
    keyTerminology: t.keyTerminology,
    recommendedLevel: t.recommendedLevel,
    sectionIds: t.sectionIds,
    isDemo: false,
  }));
}
