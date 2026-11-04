import type { Recommendation } from '@/types';

export const DEMO_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-001',
    type: 'study',
    title: 'Master Functional Dependencies',
    description: 'Your quiz performance shows Functional Dependencies needs more attention. Study Armstrong\'s Axioms and practice closure computations.',
    topicId: 'topic-demo-3',
    documentId: 'demo-dbms-001',
    priority: 'high',
    reason: 'Quiz score of 45% in this topic — below your average of 90%',
  },
  {
    id: 'rec-002',
    type: 'practice',
    title: 'Practice Normalization Questions',
    description: 'Take a focused quiz on normalization to improve your 3NF and BCNF understanding. Try the moderate difficulty level.',
    topicId: 'topic-demo-4',
    documentId: 'demo-dbms-001',
    priority: 'high',
    reason: 'You got one normalization question wrong in your last attempt',
  },
  {
    id: 'rec-003',
    type: 'review',
    title: 'Review Relational Algebra',
    description: 'You haven\'t revisited Relational Model concepts in 5 days. A quick review of join operations will strengthen your foundation.',
    topicId: 'topic-demo-1',
    documentId: 'demo-dbms-001',
    priority: 'medium',
    reason: 'Last studied 5 days ago — spaced repetition recommends a review',
  },
  {
    id: 'rec-004',
    type: 'study',
    title: 'Try Tamil Translation',
    description: 'Read the Transactions chapter in Tamil to reinforce your understanding through your mother tongue.',
    topicId: 'topic-demo-5',
    documentId: 'demo-dbms-001',
    priority: 'low',
    reason: 'Bilingual learning improves retention — you haven\'t tried Tamil yet',
  },
];
