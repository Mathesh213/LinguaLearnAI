import type { LearningProgress, WeeklyActivity, TopicMastery, QuizHistoryEntry } from '@/types';
import { DEMO_QUIZ_ATTEMPTS } from './quizzes';

export const DEMO_PROGRESS: LearningProgress = {
  documentId: 'demo-dbms-001',
  topicsCompleted: ['topic-demo-0', 'topic-demo-1', 'topic-demo-2'],
  quizAttempts: DEMO_QUIZ_ATTEMPTS,
  bookmarks: [],
  lastStudiedAt: new Date('2024-10-31T14:30:00'),
  totalStudyTimeMinutes: 185,
  overallMastery: 62,
};

export const DEMO_WEEKLY_ACTIVITY: WeeklyActivity[] = [
  { day: 'Mon', minutes: 35, topics: 1 },
  { day: 'Tue', minutes: 20, topics: 1 },
  { day: 'Wed', minutes: 55, topics: 2 },
  { day: 'Thu', minutes: 10, topics: 0 },
  { day: 'Fri', minutes: 40, topics: 2 },
  { day: 'Sat', minutes: 15, topics: 1 },
  { day: 'Sun', minutes: 10, topics: 0 },
];

export const DEMO_TOPIC_MASTERY: TopicMastery[] = [
  { topic: 'DB Fundamentals', mastery: 92, quizzes: 3 },
  { topic: 'Relational Model', mastery: 78, quizzes: 2 },
  { topic: 'Database Keys', mastery: 85, quizzes: 4 },
  { topic: 'Functional Deps', mastery: 45, quizzes: 1 },
  { topic: 'Normalization', mastery: 55, quizzes: 2 },
  { topic: 'Transactions', mastery: 70, quizzes: 2 },
];

export const DEMO_QUIZ_HISTORY: QuizHistoryEntry[] = [
  { date: 'Oct 25', score: 60, questions: 5 },
  { date: 'Oct 27', score: 70, questions: 5 },
  { date: 'Oct 29', score: 80, questions: 5 },
  { date: 'Oct 31', score: 100, questions: 5 },
];

export const DEMO_STATS = {
  documentsStudied: 1,
  topicsCompleted: 3,
  topicsTotal: 6,
  averageQuizScore: 90,
  totalStudyMinutes: 185,
  currentStreak: 4,
  longestStreak: 7,
  totalQuizzesTaken: 2,
};
