'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Trophy, Zap, Clock, Target, TrendingUp, Calendar, Award } from 'lucide-react';
import {
  DEMO_WEEKLY_ACTIVITY, DEMO_TOPIC_MASTERY, DEMO_QUIZ_HISTORY, DEMO_STATS,
} from '@/lib/demo-data/progress';
import { DEMO_QUIZ_ATTEMPTS } from '@/lib/demo-data/quizzes';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, PieChart, Pie,
} from 'recharts';

const statCards = [
  { label: 'Study Time', value: `${DEMO_STATS.totalStudyMinutes}m`, icon: Clock, color: 'var(--color-editorial-blue)', bg: 'rgba(34,97,146,0.08)' },
  { label: 'Quiz Average', value: `${DEMO_STATS.averageQuizScore}%`, icon: Trophy, color: '#16a34a', bg: 'rgba(34,197,94,0.08)' },
  { label: 'Topics Done', value: `${DEMO_STATS.topicsCompleted}/${DEMO_STATS.topicsTotal}`, icon: Target, color: 'var(--color-coral)', bg: 'rgba(239,133,87,0.08)' },
  { label: 'Day Streak', value: `${DEMO_STATS.currentStreak}d`, icon: Zap, color: '#ca8a04', bg: 'rgba(234,179,8,0.08)' },
];

export default function ProgressPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-ivory)' }}>
      <ProgressTopBar />

      <main id="main-content" className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--color-coral)' }}>My Progress</span>
          <h1 className="font-black mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: 'var(--color-ink)' }}>
            Track your{' '}
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', color: 'var(--color-editorial-blue)' }}>learning journey.</span>
          </h1>
          <p style={{ color: 'rgba(32,43,53,0.55)' }}>Detailed analytics of your study habits, quiz performance, and topic mastery.</p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: card.bg }}>
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <div className="text-2xl font-black mb-1" style={{ color: 'var(--color-ink)' }}>{card.value}</div>
              <div className="text-xs font-medium" style={{ color: 'rgba(32,43,53,0.5)' }}>{card.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={15} style={{ color: 'var(--color-editorial-blue)' }} />
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Weekly Activity</h3>
                <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>Minutes studied per day</p>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEMO_WEEKLY_ACTIVITY} barSize={28}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(32,43,53,0.4)' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`${v} min`, 'Study time'] as [string, string]} />
                  <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                    {DEMO_WEEKLY_ACTIVITY.map((_, i) => (
                      <Cell key={i} fill={i === 4 ? 'var(--color-coral)' : 'var(--color-editorial-blue)'} opacity={i === 4 ? 1 : 0.65} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quiz score over time */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} style={{ color: 'var(--color-coral)' }} />
              <div>
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Quiz Score Trend</h3>
                <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>Score improvement over time</p>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DEMO_QUIZ_HISTORY}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(32,43,53,0.06)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(32,43,53,0.4)' }} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(32,43,53,0.4)' }} />
                  <Tooltip contentStyle={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)', borderRadius: 8, fontSize: 12 }}
                    formatter={(v) => [`${v}%`, 'Score'] as [string, string]} />
                  <Line type="monotone" dataKey="score" stroke="var(--color-coral)" strokeWidth={2.5} dot={{ r: 5, fill: 'var(--color-coral)', strokeWidth: 0 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Topic mastery */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-2xl p-5 mb-8" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Award size={15} style={{ color: '#ca8a04' }} />
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Topic Mastery</h3>
              <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>Based on quiz performance</p>
            </div>
          </div>
          <div className="space-y-4">
            {DEMO_TOPIC_MASTERY.map((item, i) => (
              <motion.div key={item.topic} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{item.topic}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: 'rgba(32,43,53,0.4)' }}>{item.quizzes} quiz{item.quizzes !== 1 ? 'zes' : ''}</span>
                    <span className="text-sm font-black" style={{ color: item.mastery >= 80 ? '#16a34a' : item.mastery >= 60 ? '#ca8a04' : 'var(--color-coral)', minWidth: '2.5rem', textAlign: 'right' }}>
                      {item.mastery}%
                    </span>
                  </div>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(32,43,53,0.08)' }}>
                  <motion.div className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.mastery}%` }}
                    transition={{ duration: 0.9, delay: 0.6 + i * 0.1, ease: 'easeOut' }}
                    style={{ background: item.mastery >= 80 ? '#22c55e' : item.mastery >= 60 ? '#eab308' : 'var(--color-coral)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quiz history */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={15} style={{ color: '#ca8a04' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Quiz History</h3>
            </div>
            <Link href="/practice" className="text-xs font-semibold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: 'var(--color-editorial-blue)' }}>
              Take Quiz →
            </Link>
          </div>
          <div className="space-y-3">
            {DEMO_QUIZ_ATTEMPTS.map(attempt => (
              <div key={attempt.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.06)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: attempt.score >= 80 ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)' }}>
                  <span className="text-lg font-black" style={{ color: attempt.score >= 80 ? '#16a34a' : '#ca8a04' }}>{attempt.score}%</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>DBMS Quiz</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,97,146,0.08)', color: 'var(--color-editorial-blue)' }}>intermediate</span>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>{attempt.correctCount}/{attempt.totalQuestions} correct · {Math.round(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s</span>
                </div>
                <div className="text-xs" style={{ color: 'rgba(32,43,53,0.35)' }}>
                  {attempt.completedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function ProgressTopBar() {
  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(234,230,222,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(32,43,53,0.08)' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-editorial-blue)' }}>
            <BookOpen size={15} className="text-white" />
          </div>
          <span className="font-bold" style={{ color: 'var(--color-ink)' }}>LinguaLearn<span style={{ color: 'var(--color-coral)' }}> AI</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'rgba(32,43,53,0.65)' }}>Dashboard</Link>
          <Link href="/practice" className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-coral)', color: 'white' }}>Practice</Link>
        </div>
      </div>
    </nav>
  );
}
