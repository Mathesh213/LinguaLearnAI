import { generateJSON, truncateForTokens, TOKEN_LIMITS } from './gemini';
import { buildQuizPrompt } from './prompts';
import { QuizResponseSchema, type QuizResponse } from './schemas';
import type {
  DocumentSection,
  Quiz,
  QuizQuestion,
  Language,
  LearningLevel,
  DifficultyCategory,
  QuestionType,
} from '@/types';

export async function generateQuiz(params: {
  documentId: string;
  sections: DocumentSection[];
  topicNames: string[];
  questionCount: number;
  difficulty: DifficultyCategory;
  language: Language;
  level: LearningLevel;
  questionTypes: QuestionType[];
}): Promise<Quiz> {
  const { documentId, sections, topicNames, questionCount, difficulty, language, level, questionTypes } =
    params;

  // Pick the most relevant sections (up to 8) and truncate
  const selectedSections = sections
    .slice(0, 8)
    .map((s) => ({
      id: s.id,
      title: s.title,
      content: truncateForTokens(s.content, 1200),
    }));

  const prompt = buildQuizPrompt({
    sections: selectedSections,
    topicNames,
    questionCount,
    difficulty,
    language,
    questionTypes,
  });

  let response: QuizResponse;
  try {
    response = await generateJSON<QuizResponse>(prompt);
    const parsed = QuizResponseSchema.safeParse(response);
    if (!parsed.success) {
      throw new Error(`Schema validation: ${parsed.error.message}`);
    }
    response = parsed.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Quiz generation failed: ${msg}`);
  }

  // Validate MCQ questions: ensure correctAnswer matches one of options
  const validatedQuestions: QuizQuestion[] = response.questions.map((q, idx) => {
    if (q.type === 'mcq' && q.options) {
      const matchesOption = q.options.some(
        (opt) => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      );
      if (!matchesOption) {
        // Auto-correct: use first option as correct answer
        console.warn(`MCQ question ${idx} correctAnswer doesn't match options, correcting...`);
        return {
          ...q,
          id: `q-${documentId}-${idx}-${Date.now()}`,
          correctAnswer: q.options[0],
        } as QuizQuestion;
      }
    }
    return {
      ...q,
      id: `q-${documentId}-${idx}-${Date.now()}`,
    } as QuizQuestion;
  });

  return {
    id: `quiz-${documentId}-${Date.now()}`,
    documentId,
    topicIds: [],
    questions: validatedQuestions,
    language,
    level,
    createdAt: new Date(),
    isDemo: false,
  };
}
