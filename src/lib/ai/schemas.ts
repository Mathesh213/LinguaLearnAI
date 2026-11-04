import { z } from 'zod';

// ── Translation ─────────────────────────────────────────────
export const TranslationResponseSchema = z.object({
  sections: z.array(
    z.object({
      sectionId: z.string(),
      originalText: z.string(),
      translatedText: z.string(),
      technicalTerms: z.array(z.string()),
    })
  ),
  glossary: z.array(
    z.object({
      term: z.string(),
      transliteration: z.string().optional(),
      translation: z.string(),
      definition: z.string(),
    })
  ),
  warnings: z.array(z.string()),
});

export type TranslationResponse = z.infer<typeof TranslationResponseSchema>;

// ── Simplification ──────────────────────────────────────────
export const SimplificationResponseSchema = z.object({
  sections: z.array(
    z.object({
      sectionId: z.string(),
      title: z.string(),
      simplifiedText: z.string(),
      keyPoints: z.array(z.string()),
      analogy: z.string().optional(),
      example: z.string().optional(),
    })
  ),
  conceptCoverage: z.number().min(0).max(100),
  warnings: z.array(z.string()),
});

export type SimplificationResponse = z.infer<typeof SimplificationResponseSchema>;

// ── Topic Analysis ──────────────────────────────────────────
export const TopicAnalysisResponseSchema = z.object({
  topics: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      difficultyScore: z.number().min(0).max(100),
      difficultyCategory: z.enum(['easy', 'moderate', 'difficult']),
      prerequisites: z.array(z.string()),
      subtopics: z.array(z.string()),
      keyTerminology: z.array(z.string()),
      recommendedLevel: z.enum(['beginner', 'intermediate', 'advanced']),
      sectionIds: z.array(z.string()),
    })
  ),
});

export type TopicAnalysisResponse = z.infer<typeof TopicAnalysisResponseSchema>;

// ── Quiz ────────────────────────────────────────────────────
export const QuizResponseSchema = z.object({
  questions: z.array(
    z.object({
      type: z.enum(['mcq', 'fill-blank', 'short-answer']),
      question: z.string(),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      explanation: z.string(),
      sourceSection: z.string(),
      sourceExcerpt: z.string(),
      difficulty: z.enum(['easy', 'moderate', 'difficult']),
    })
  ),
});

export type QuizResponse = z.infer<typeof QuizResponseSchema>;

// ── Concept Explanation ─────────────────────────────────────
export const ConceptExplanationSchema = z.object({
  concept: z.string(),
  simpleExplanation: z.string(),
  realWorldAnalogy: z.string(),
  keyPoints: z.array(z.string()),
  relatedConcepts: z.array(z.string()),
  practiceQuestions: z.array(z.string()),
  sourceExcerpt: z.string(),
});

export type ConceptExplanationResponse = z.infer<typeof ConceptExplanationSchema>;

// ── Validation ──────────────────────────────────────────────
export const ValidationResponseSchema = z.object({
  isValid: z.boolean(),
  score: z.number().min(0).max(100),
  warnings: z.array(z.string()),
  errors: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export type ValidationResponse = z.infer<typeof ValidationResponseSchema>;
