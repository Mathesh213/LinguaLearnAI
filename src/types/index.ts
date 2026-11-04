// ─────────────────────────────────────────────
// Document types
// ─────────────────────────────────────────────
export type DocumentStatus = 'uploading' | 'processing' | 'ready' | 'error';
export type SupportedFormat = 'pdf' | 'docx' | 'pptx' | 'txt';
export type Language = 'english' | 'tamil' | 'hindi' | 'telugu' | 'malayalam';
export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';
export type DifficultyCategory = 'easy' | 'moderate' | 'difficult';
export type QuestionType = 'mcq' | 'fill-blank' | 'short-answer';

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  pageNumber?: number;
  order: number;
}

export interface StudyDocument {
  id: string;
  name: string;
  format: SupportedFormat;
  size: number;
  uploadedAt: Date;
  status: DocumentStatus;
  sections: DocumentSection[];
  rawText: string;
  pageCount?: number;
  isDemo?: boolean;
}

// ─────────────────────────────────────────────
// Translation types
// ─────────────────────────────────────────────
export interface Translation {
  id: string;
  documentId: string;
  language: Language;
  sections: TranslatedSection[];
  glossary: GlossaryEntry[];
  createdAt: Date;
  warnings: string[];
  isDemo?: boolean;
}

export interface TranslatedSection {
  sectionId: string;
  originalText: string;
  translatedText: string;
  technicalTerms: string[];
}

export interface GlossaryEntry {
  term: string;
  transliteration?: string;
  translation: string;
  definition: string;
}

// ─────────────────────────────────────────────
// Simplified content types
// ─────────────────────────────────────────────
export interface SimplifiedContent {
  id: string;
  documentId: string;
  level: LearningLevel;
  language: Language;
  sections: SimplifiedSection[];
  createdAt: Date;
  conceptCoverage: number;
  warnings: string[];
  isDemo?: boolean;
}

export interface SimplifiedSection {
  sectionId: string;
  title: string;
  simplifiedText: string;
  keyPoints: string[];
  analogy?: string;
  example?: string;
}

// ─────────────────────────────────────────────
// Topic types
// ─────────────────────────────────────────────
export interface Topic {
  id: string;
  documentId: string;
  name: string;
  description: string;
  difficultyScore: number;
  difficultyCategory: DifficultyCategory;
  prerequisites: string[];
  subtopics: string[];
  keyTerminology: string[];
  recommendedLevel: LearningLevel;
  sectionIds: string[];
  isDemo?: boolean;
}

// ─────────────────────────────────────────────
// Quiz types
// ─────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  topicId?: string;
  sourceSection: string;
  sourceExcerpt: string;
  difficulty: DifficultyCategory;
}

export interface Quiz {
  id: string;
  documentId: string;
  topicIds: string[];
  questions: QuizQuestion[];
  language: Language;
  level: LearningLevel;
  createdAt: Date;
  isDemo?: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  documentId: string;
  answers: Record<string, string>;
  score: number;
  totalQuestions: number;
  correctCount: number;
  weakTopics: string[];
  completedAt: Date;
  timeTakenSeconds: number;
}

// ─────────────────────────────────────────────
// Learning progress types
// ─────────────────────────────────────────────
export interface LearningProgress {
  documentId: string;
  topicsCompleted: string[];
  quizAttempts: QuizAttempt[];
  bookmarks: Bookmark[];
  lastStudiedAt?: Date;
  totalStudyTimeMinutes: number;
  overallMastery: number;
}

export interface Bookmark {
  id: string;
  documentId: string;
  sectionId: string;
  note?: string;
  createdAt: Date;
}

// ─────────────────────────────────────────────
// User preference types
// ─────────────────────────────────────────────
export interface UserPreferences {
  preferredLanguage: Language;
  learningLevel: LearningLevel;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  highContrast: boolean;
  dyslexiaFont: boolean;
  readingMode: boolean;
  theme: 'light' | 'dark';
  speechRate: number;
  speechPitch: number;
}

// ─────────────────────────────────────────────
// Recommendation types
// ─────────────────────────────────────────────
export interface Recommendation {
  id: string;
  type: 'study' | 'practice' | 'review';
  title: string;
  description: string;
  topicId?: string;
  documentId?: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

// ─────────────────────────────────────────────
// Concept explanation types
// ─────────────────────────────────────────────
export interface ConceptExplanation {
  concept: string;
  simpleExplanation: string;
  realWorldAnalogy: string;
  keyPoints: string[];
  relatedConcepts: string[];
  practiceQuestions: string[];
  sourceExcerpt: string;
  isDemo?: boolean;
}

// ─────────────────────────────────────────────
// Validation & processing types
// ─────────────────────────────────────────────
export interface ValidationResult {
  isValid: boolean;
  score: number;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export interface ProcessingStage {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'done' | 'error';
}

// ── Chart / progress data ────────────────────────────────────
export interface WeeklyActivity {
  day: string;
  minutes: number;
  topics: number;
}

export interface TopicMastery {
  topic: string;
  mastery: number;
  quizzes: number;
}

export interface QuizHistoryEntry {
  date: string;
  score: number;
  questions: number;
}

// ── API request types ────────────────────────────────────────
export interface ApiError {
  error: string;
  details?: string;
  code?: string;
}

export interface TranslateRequest {
  documentId: string;
  sections: Pick<DocumentSection, 'id' | 'title' | 'content' | 'order'>[];
  targetLanguage: Language;
}

export interface SimplifyRequest {
  documentId: string;
  sections: Pick<DocumentSection, 'id' | 'title' | 'content' | 'order'>[];
  level: LearningLevel;
  language: Language;
}

export interface AnalyzeTopicsRequest {
  documentId: string;
  sections: Pick<DocumentSection, 'id' | 'title' | 'content' | 'order'>[];
  documentTitle: string;
}

export interface GenerateQuizRequest {
  documentId: string;
  sections: Pick<DocumentSection, 'id' | 'title' | 'content' | 'order'>[];
  topicNames: string[];
  questionCount: number;
  difficulty: DifficultyCategory;
  language: Language;
  level: LearningLevel;
  questionTypes: QuestionType[];
}

export interface ExplainConceptRequest {
  concept: string;
  documentContext: string;
  level: LearningLevel;
  language: Language;
}
