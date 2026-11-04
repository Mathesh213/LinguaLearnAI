'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Zap, CheckCircle, X, ArrowRight, Loader2,
  AlertCircle, Trophy, Clock, ChevronLeft, ChevronRight,
  Sparkles, Target, BarChart2,
} from 'lucide-react';
import { DEMO_QUIZ_QUESTIONS, DEMO_QUIZZES, DEMO_QUIZ_ATTEMPTS } from '@/lib/demo-data/quizzes';
import { DEMO_TOPICS } from '@/lib/demo-data/topics';
import { DEMO_DOCUMENTS } from '@/lib/demo-data/documents';
import type { QuizQuestion, DifficultyCategory, Language, LearningLevel, QuestionType } from '@/types';

type QuizMode = 'configure' | 'quiz' | 'results';

const DIFFICULTIES: { value: DifficultyCategory; label: string; desc: string }[] = [
  { value: 'easy', label: 'Easy', desc: 'Basic recall & definitions' },
  { value: 'moderate', label: 'Moderate', desc: 'Application & understanding' },
  { value: 'difficult', label: 'Difficult', desc: 'Analysis & edge cases' },
];

export default function PracticePage() {
  const [mode, setMode] = useState<QuizMode>('configure');
  const [difficulty, setDifficulty] = useState<DifficultyCategory>('moderate');
  const [language, setLanguage] = useState<Language>('english');
  const [level, setLevel] = useState<LearningLevel>('intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['mcq']);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(DEMO_TOPICS.map(t => t.id));
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>(DEMO_QUIZ_QUESTIONS);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);

  const doc = DEMO_DOCUMENTS[0];

  const toggleType = (type: QuestionType) => {
    setQuestionTypes(prev => prev.includes(type) ? (prev.length > 1 ? prev.filter(t => t !== type) : prev) : [...prev, type]);
  };

  const toggleTopic = (id: string) => {
    setSelectedTopics(prev => prev.includes(id) ? (prev.length > 1 ? prev.filter(t => t !== id) : prev) : [...prev, id]);
  };

  const handleGenerate = async () => {
    setGenerating(true); setGenError(null);
    try {
      const topicNames = DEMO_TOPICS.filter(t => selectedTopics.includes(t.id)).map(t => t.name);
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: doc.id,
          sections: doc.sections.slice(0, 6).map(s => ({ id: s.id, title: s.title, content: s.content, order: s.order })),
          topicNames,
          questionCount,
          difficulty,
          language,
          level,
          questionTypes,
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const quiz = await res.json();
      setQuestions(quiz.questions);
      startQuiz(quiz.questions);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed';
      // Fall back to demo questions if API fails
      if (msg.includes('API_KEY_MISSING') || msg.includes('not configured')) {
        setGenError('No Gemini API key — using demo questions instead.');
        startQuiz(DEMO_QUIZ_QUESTIONS);
      } else {
        setGenError(msg);
      }
    } finally { setGenerating(false); }
  };

  const startQuiz = (qs: QuizQuestion[]) => {
    setQuestions(qs);
    setCurrentQ(0);
    setAnswers({});
    setSubmitted({});
    setShowExplanation({});
    setQuizStartTime(new Date());
    setMode('quiz');
  };

  const handleAnswer = (questionId: string, answer: string) => {
    if (submitted[questionId]) return;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitAnswer = (questionId: string) => {
    if (!answers[questionId]) return;
    setSubmitted(prev => ({ ...prev, [questionId]: true }));
    setShowExplanation(prev => ({ ...prev, [questionId]: true }));
  };

  const handleFinish = () => setMode('results');

  const q = questions[currentQ];
  const isCorrect = q && submitted[q.id] ? answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() : null;
  const correctCount = questions.filter(q => answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim()).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const timeTaken = quizStartTime ? Math.round((Date.now() - quizStartTime.getTime()) / 1000) : 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-ivory)' }}>
      <PracticeTopBar />
      <main id="main-content" className="max-w-4xl mx-auto px-4 md:px-8 py-10">

        {/* Configure */}
        {mode === 'configure' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--color-coral)' }}>AI Practice Arena</span>
            <h1 className="font-black mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: 'var(--color-ink)' }}>
              Build your{' '}
              <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', color: 'var(--color-editorial-blue)' }}>perfect quiz.</span>
            </h1>
            <p className="mb-8" style={{ color: 'rgba(32,43,53,0.55)' }}>Gemini AI generates questions from your document content with source traceability.</p>

            {/* Past attempts */}
            {DEMO_QUIZ_ATTEMPTS.length > 0 && (
              <div className="rounded-2xl p-5 mb-6" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={15} style={{ color: '#ca8a04' }} />
                  <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Recent Performance</h3>
                </div>
                <div className="flex gap-4">
                  {DEMO_QUIZ_ATTEMPTS.map(attempt => (
                    <div key={attempt.id} className="flex-1 p-3 rounded-xl" style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.06)' }}>
                      <div className="text-2xl font-black mb-1" style={{ color: attempt.score >= 80 ? '#16a34a' : attempt.score >= 60 ? '#ca8a04' : 'var(--color-coral)' }}>
                        {attempt.score}%
                      </div>
                      <div className="text-xs" style={{ color: 'rgba(32,43,53,0.5)' }}>{attempt.correctCount}/{attempt.totalQuestions} correct</div>
                      <div className="text-xs" style={{ color: 'rgba(32,43,53,0.4)' }}>{Math.round(attempt.timeTakenSeconds / 60)} min</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Topics */}
              <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>Topics to Cover</h3>
                <div className="space-y-1.5">
                  {DEMO_TOPICS.map(t => (
                    <button key={t.id} onClick={() => toggleTopic(t.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                      style={{ background: selectedTopics.includes(t.id) ? 'rgba(34,97,146,0.08)' : 'var(--color-ivory)', border: `1px solid ${selectedTopics.includes(t.id) ? 'rgba(34,97,146,0.2)' : 'rgba(32,43,53,0.06)'}`, color: 'var(--color-ink)' }}>
                      <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all`}
                        style={{ borderColor: selectedTopics.includes(t.id) ? 'var(--color-editorial-blue)' : 'rgba(32,43,53,0.2)', background: selectedTopics.includes(t.id) ? 'var(--color-editorial-blue)' : 'transparent' }}>
                        {selectedTopics.includes(t.id) && <CheckCircle size={10} className="text-white" />}
                      </div>
                      <span className="flex-1 text-left">{t.name}</span>
                      <span className="text-xs" style={{ color: 'rgba(32,43,53,0.4)' }}>{t.difficultyScore}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-5">
                {/* Difficulty */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>Difficulty</h3>
                  <div className="space-y-2">
                    {DIFFICULTIES.map(d => (
                      <button key={d.value} onClick={() => setDifficulty(d.value)}
                        className="w-full text-left px-3 py-2.5 rounded-xl transition-all"
                        style={{ background: difficulty === d.value ? 'rgba(239,133,87,0.08)' : 'var(--color-ivory)', border: `1.5px solid ${difficulty === d.value ? 'rgba(239,133,87,0.3)' : 'rgba(32,43,53,0.06)'}` }}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{d.label}</span>
                          {difficulty === d.value && <CheckCircle size={14} style={{ color: 'var(--color-coral)' }} />}
                        </div>
                        <p className="text-xs" style={{ color: 'rgba(32,43,53,0.5)' }}>{d.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question types */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                  <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>Question Types</h3>
                  <div className="flex gap-2 flex-wrap">
                    {(['mcq', 'fill-blank', 'short-answer'] as QuestionType[]).map(type => (
                      <button key={type} onClick={() => toggleType(type)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                        style={{ background: questionTypes.includes(type) ? 'var(--color-editorial-blue)' : 'var(--color-ivory)', color: questionTypes.includes(type) ? 'white' : 'rgba(32,43,53,0.65)', border: '1px solid rgba(32,43,53,0.08)' }}>
                        {type.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Count */}
                <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Questions</h3>
                    <span className="text-2xl font-black" style={{ color: 'var(--color-editorial-blue)' }}>{questionCount}</span>
                  </div>
                  <input type="range" min={3} max={15} value={questionCount} onChange={e => setQuestionCount(parseInt(e.target.value))}
                    className="w-full" style={{ accentColor: 'var(--color-editorial-blue)' }} />
                  <div className="flex justify-between text-xs mt-1" style={{ color: 'rgba(32,43,53,0.4)' }}>
                    <span>3 min</span><span>15 max</span>
                  </div>
                </div>
              </div>
            </div>

            {genError && (
              <div className="mt-4 flex items-start gap-2 p-4 rounded-xl" style={{ background: 'rgba(239,133,87,0.08)', border: '1px solid rgba(239,133,87,0.2)' }}>
                <AlertCircle size={15} style={{ color: 'var(--color-coral)', flexShrink: 0 }} />
                <p className="text-sm" style={{ color: 'rgba(32,43,53,0.7)' }}>{genError}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button onClick={handleGenerate} disabled={generating}
                className="flex-1 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ background: 'var(--color-editorial-blue)', color: 'white', boxShadow: '0 4px 24px rgba(34,97,146,0.3)' }}>
                {generating ? <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Generating…</span>
                  : <span className="flex items-center justify-center gap-2"><Sparkles size={16} /> Generate Quiz with Gemini AI</span>}
              </button>
              <button onClick={() => startQuiz(DEMO_QUIZ_QUESTIONS)}
                className="px-6 py-4 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-soft-neutral)', color: 'var(--color-ink)', border: '1px solid rgba(32,43,53,0.08)' }}>
                Use Demo Quiz
              </button>
            </div>
          </motion.div>
        )}

        {/* Quiz */}
        {mode === 'quiz' && q && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Progress */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(32,43,53,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, background: 'var(--color-editorial-blue)' }} />
              </div>
              <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--color-ink)' }}>{currentQ + 1}/{questions.length}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={q.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <div className="rounded-2xl p-6 mb-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: 'rgba(34,97,146,0.08)', color: 'var(--color-editorial-blue)' }}>{q.type.replace('-', ' ')}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: q.difficulty === 'easy' ? 'rgba(34,197,94,0.1)' : q.difficulty === 'moderate' ? 'rgba(234,179,8,0.1)' : 'rgba(239,133,87,0.1)', color: q.difficulty === 'easy' ? '#16a34a' : q.difficulty === 'moderate' ? '#ca8a04' : 'var(--color-coral)' }}>{q.difficulty}</span>
                    <span className="ml-auto text-xs" style={{ color: 'rgba(32,43,53,0.4)' }}>From: {q.sourceSection}</span>
                  </div>
                  <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--color-ink)', lineHeight: 1.4 }}>{q.question}</h2>

                  {/* MCQ options */}
                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-2">
                      {q.options.map((opt, i) => {
                        const isSelected = answers[q.id] === opt;
                        const isSubmitted = !!submitted[q.id];
                        const isCorrectOpt = opt.toLowerCase() === q.correctAnswer.toLowerCase();
                        let optStyle = { background: 'var(--color-ivory)', border: '1.5px solid rgba(32,43,53,0.08)', color: 'var(--color-ink)' };
                        if (isSubmitted) {
                          if (isCorrectOpt) optStyle = { background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.3)', color: '#166534' };
                          else if (isSelected) optStyle = { background: 'rgba(239,133,87,0.08)', border: '1.5px solid rgba(239,133,87,0.3)', color: 'var(--color-coral)' };
                        } else if (isSelected) {
                          optStyle = { background: 'rgba(34,97,146,0.08)', border: '1.5px solid rgba(34,97,146,0.3)', color: 'var(--color-editorial-blue)' };
                        }
                        return (
                          <button key={i} onClick={() => handleAnswer(q.id, opt)} disabled={isSubmitted}
                            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                            style={optStyle}>
                            <span className="inline-flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ borderColor: isSelected || (isSubmitted && isCorrectOpt) ? 'currentColor' : 'rgba(32,43,53,0.2)', background: isSelected || (isSubmitted && isCorrectOpt) ? 'currentColor' : 'transparent', color: isSelected || (isSubmitted && isCorrectOpt) ? 'white' : 'rgba(32,43,53,0.3)' }}>
                                {String.fromCharCode(65 + i)}
                              </span>
                              {opt}
                              {isSubmitted && isCorrectOpt && <CheckCircle size={15} className="ml-auto" style={{ color: '#16a34a' }} />}
                              {isSubmitted && isSelected && !isCorrectOpt && <X size={15} className="ml-auto" style={{ color: 'var(--color-coral)' }} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Fill blank / short answer */}
                  {(q.type === 'fill-blank' || q.type === 'short-answer') && (
                    <div>
                      <input
                        type="text"
                        value={answers[q.id] ?? ''}
                        onChange={e => handleAnswer(q.id, e.target.value)}
                        disabled={!!submitted[q.id]}
                        placeholder={q.type === 'fill-blank' ? 'Type the missing word…' : 'Type your answer…'}
                        className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all"
                        style={{ background: 'var(--color-ivory)', border: submitted[q.id] ? (isCorrect ? '1.5px solid rgba(34,197,94,0.4)' : '1.5px solid rgba(239,133,87,0.4)') : '1.5px solid rgba(32,43,53,0.12)', color: 'var(--color-ink)' }}
                      />
                      {submitted[q.id] && !isCorrect && (
                        <p className="mt-2 text-sm font-medium" style={{ color: '#16a34a' }}>✓ Correct answer: <strong>{q.correctAnswer}</strong></p>
                      )}
                    </div>
                  )}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showExplanation[q.id] && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="rounded-2xl p-5 mb-5 overflow-hidden"
                      style={{ background: isCorrect ? 'rgba(34,197,94,0.06)' : 'rgba(239,133,87,0.06)', border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,133,87,0.2)'}` }}>
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? <CheckCircle size={15} style={{ color: '#16a34a' }} /> : <AlertCircle size={15} style={{ color: 'var(--color-coral)' }} />}
                        <span className="text-sm font-bold" style={{ color: isCorrect ? '#16a34a' : 'var(--color-coral)' }}>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                      </div>
                      <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--color-ink)' }}>{q.explanation}</p>
                      <div className="text-xs italic px-3 py-2 rounded-lg" style={{ background: 'rgba(32,43,53,0.04)', color: 'rgba(32,43,53,0.55)' }}>
                        Source: {q.sourceSection} — "{q.sourceExcerpt}"
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controls */}
                <div className="flex gap-3">
                  {!submitted[q.id] ? (
                    <button onClick={() => handleSubmitAnswer(q.id)} disabled={!answers[q.id]}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-40"
                      style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                      Submit Answer
                    </button>
                  ) : currentQ < questions.length - 1 ? (
                    <button onClick={() => setCurrentQ(c => c + 1)}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                      Next Question <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button onClick={handleFinish}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                      style={{ background: 'var(--color-coral)', color: 'white' }}>
                      See Results <Trophy size={16} />
                    </button>
                  )}
                  {currentQ > 0 && !submitted[q.id] && (
                    <button onClick={() => setCurrentQ(c => c - 1)}
                      className="px-4 py-3 rounded-xl transition-all"
                      style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)', color: 'rgba(32,43,53,0.65)' }}>
                      <ChevronLeft size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Results */}
        {mode === 'results' && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center mb-10">
              <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: score >= 80 ? 'rgba(34,197,94,0.1)' : score >= 60 ? 'rgba(234,179,8,0.1)' : 'rgba(239,133,87,0.1)', border: `2px solid ${score >= 80 ? 'rgba(34,197,94,0.3)' : score >= 60 ? 'rgba(234,179,8,0.3)' : 'rgba(239,133,87,0.3)'}` }}>
                <span className="text-3xl font-black" style={{ color: score >= 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : 'var(--color-coral)' }}>{score}%</span>
              </div>
              <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--color-ink)' }}>
                {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good effort!' : 'Keep practicing!'}
              </h2>
              <p style={{ color: 'rgba(32,43,53,0.55)' }}>
                {correctCount}/{questions.length} correct · {Math.round(timeTaken / 60)}m {timeTaken % 60}s
              </p>
            </div>

            {/* Question review */}
            <div className="space-y-3 mb-8">
              {questions.map((q, i) => {
                const answered = answers[q.id];
                const correct = answered?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                return (
                  <div key={q.id} className="p-4 rounded-xl" style={{ background: 'var(--color-soft-neutral)', border: `1px solid ${correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,133,87,0.15)'}` }}>
                    <div className="flex items-start gap-3">
                      {correct ? <CheckCircle size={16} style={{ color: '#16a34a', flexShrink: 0 }} /> : <X size={16} style={{ color: 'var(--color-coral)', flexShrink: 0 }} />}
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-ink)' }}>{q.question}</p>
                        {!correct && <p className="text-xs" style={{ color: '#16a34a' }}>Correct: {q.correctAnswer}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setMode('configure'); setGenError(null); }}
                className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                New Quiz
              </button>
              <button onClick={() => startQuiz(questions)}
                className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-soft-neutral)', color: 'var(--color-ink)', border: '1px solid rgba(32,43,53,0.08)' }}>
                Retry Same Quiz
              </button>
              <Link href="/progress" className="px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] flex items-center gap-2"
                style={{ background: 'var(--color-coral)', color: 'white' }}>
                <BarChart2 size={15} /> Progress
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function PracticeTopBar() {
  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(234,230,222,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(32,43,53,0.08)' }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-editorial-blue)' }}>
            <BookOpen size={15} className="text-white" />
          </div>
          <span className="font-bold" style={{ color: 'var(--color-ink)' }}>LinguaLearn<span style={{ color: 'var(--color-coral)' }}> AI</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'rgba(32,43,53,0.65)' }}>Dashboard</Link>
          <Link href="/topics" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'rgba(32,43,53,0.65)' }}>Topics</Link>
          <Link href="/progress" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'rgba(32,43,53,0.65)' }}>Progress</Link>
        </div>
      </div>
    </nav>
  );
}
