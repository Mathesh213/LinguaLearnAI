'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Target, Award, Zap, TrendingUp, ArrowRight,
  FileText, Clock, BarChart2, Lightbulb, ChevronRight,
  BookMarked, AlertCircle, CheckCircle, Sparkles, Upload,
} from 'lucide-react';
import { DEMO_STATS, DEMO_WEEKLY_ACTIVITY, DEMO_TOPIC_MASTERY } from '@/lib/demo-data/progress';
import { DEMO_TOPICS } from '@/lib/demo-data/topics';
import { DEMO_RECOMMENDATIONS } from '@/lib/demo-data/recommendations';
import { DEMO_DOCUMENTS } from '@/lib/demo-data/documents';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell,
} from 'recharts';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

const STAT_CARDS = [
  {
    label: 'Documents Studied',
    value: DEMO_STATS.documentsStudied,
    suffix: '',
    icon: BookOpen,
    color: 'var(--color-editorial-blue)',
    bg: 'rgba(34,97,146,0.08)',
    link: '/library',
  },
  {
    label: 'Topics Completed',
    value: `${DEMO_STATS.topicsCompleted}/${DEMO_STATS.topicsTotal}`,
    suffix: '',
    icon: Target,
    color: 'var(--color-coral)',
    bg: 'rgba(239,133,87,0.08)',
    link: '/topics',
  },
  {
    label: 'Quiz Average',
    value: DEMO_STATS.averageQuizScore,
    suffix: '%',
    icon: Award,
    color: '#16a34a',
    bg: 'rgba(34,197,94,0.08)',
    link: '/progress',
  },
  {
    label: 'Day Streak',
    value: DEMO_STATS.currentStreak,
    suffix: ' days',
    icon: Zap,
    color: '#ca8a04',
    bg: 'rgba(234,179,8,0.08)',
    link: '/progress',
  },
];

const priorityColor: Record<string, string> = {
  high: 'var(--color-coral)',
  medium: '#ca8a04',
  low: 'var(--color-editorial-blue)',
};

export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 17) setGreeting('Good afternoon');
    else if (h >= 17) setGreeting('Good evening');
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-ivory)' }}>
      {/* Top nav */}
      <DashboardTopBar />

      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">

        {/* Demo banner */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
          style={{ background: 'rgba(34,97,146,0.07)', border: '1px solid rgba(34,97,146,0.15)' }}
        >
          <Sparkles size={16} style={{ color: 'var(--color-editorial-blue)', flexShrink: 0 }} />
          <p className="text-sm" style={{ color: 'var(--color-editorial-blue)' }}>
            <strong>Demo Mode</strong> — Showing sample DBMS study data.{' '}
            <Link href="/library" className="underline font-medium">Upload your own document</Link> to get started with real AI analysis.
          </p>
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-10">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-coral)' }}>
            {greeting}
          </p>
          <h1
            className="font-black mb-2"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--color-ink)' }}
          >
            Your next breakthrough{' '}
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', color: 'var(--color-editorial-blue)' }}>
              starts here.
            </span>
          </h1>
          <p style={{ color: 'rgba(32,43,53,0.55)' }}>
            Continue where you left off — 3 topics completed in Database Management Systems.
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {STAT_CARDS.map((card, i) => (
            <motion.div key={card.label} variants={fadeUp} initial="hidden" animate="visible" custom={i + 2}>
              <Link href={card.link} className="block rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: card.bg }}>
                    <card.icon size={18} style={{ color: card.color }} />
                  </div>
                  <ChevronRight size={14} style={{ color: 'rgba(32,43,53,0.3)' }} />
                </div>
                <div className="text-2xl font-black mb-1" style={{ color: 'var(--color-ink)' }}>
                  {card.value}{card.suffix}
                </div>
                <div className="text-xs font-medium" style={{ color: 'rgba(32,43,53,0.5)' }}>{card.label}</div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left col: activity + mastery */}
          <div className="lg:col-span-2 space-y-8">

            {/* Weekly activity chart */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
              <SectionCard title="Weekly Study Activity" subtitle="Minutes studied per day" icon={BarChart2} href="/progress">
                <div className="h-48 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEMO_WEEKLY_ACTIVITY} barSize={28}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false}
                        tick={{ fontSize: 11, fill: 'rgba(32,43,53,0.4)' }} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)', borderRadius: 8, fontSize: 12 }}
                        formatter={(v) => [`${v} min`, 'Study time'] as [string, string]}
                      />
                      <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                        {DEMO_WEEKLY_ACTIVITY.map((_, i) => (
                          <Cell key={i} fill={i === 4 ? 'var(--color-coral)' : 'var(--color-editorial-blue)'} opacity={i === 4 ? 1 : 0.6} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 mt-3">
                  <div className="text-sm">
                    <span className="font-bold" style={{ color: 'var(--color-ink)' }}>{DEMO_STATS.totalStudyMinutes} min</span>
                    <span className="ml-1" style={{ color: 'rgba(32,43,53,0.5)' }}>this week</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-bold" style={{ color: 'var(--color-coral)' }}>{DEMO_STATS.currentStreak}</span>
                    <span className="ml-1" style={{ color: 'rgba(32,43,53,0.5)' }}>day streak</span>
                  </div>
                </div>
              </SectionCard>
            </motion.div>

            {/* Topic mastery */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={7}>
              <SectionCard title="Topic Mastery" subtitle="DBMS Study Guide" icon={Target} href="/topics">
                <div className="space-y-3 mt-4">
                  {DEMO_TOPIC_MASTERY.map((item, i) => (
                    <div key={item.topic}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{item.topic}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: 'rgba(32,43,53,0.4)' }}>{item.quizzes} quizzes</span>
                          <span className="text-sm font-bold" style={{ color: item.mastery >= 80 ? '#16a34a' : item.mastery >= 60 ? '#ca8a04' : 'var(--color-coral)' }}>
                            {item.mastery}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(32,43,53,0.08)' }}>
                        <motion.div className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.mastery}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                          style={{ background: item.mastery >= 80 ? '#22c55e' : item.mastery >= 60 ? '#eab308' : 'var(--color-coral)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>

            {/* Recent documents */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={8}>
              <SectionCard title="My Library" subtitle="Uploaded documents" icon={FileText} href="/library">
                <div className="mt-4 space-y-3">
                  {DEMO_DOCUMENTS.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5"
                      style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.06)' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(34,97,146,0.08)' }}>
                        <BookOpen size={16} style={{ color: 'var(--color-editorial-blue)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{doc.name}</p>
                          {doc.isDemo && (
                            <span className="text-xs px-1.5 py-0.5 rounded-md flex-shrink-0"
                              style={{ background: 'rgba(34,97,146,0.1)', color: 'var(--color-editorial-blue)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em' }}>
                              DEMO
                            </span>
                          )}
                        </div>
                        <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>
                          {doc.format.toUpperCase()} · {doc.pageCount} pages · {doc.sections.length} sections
                        </p>
                      </div>
                      <Link href={`/learning/${doc.id}`}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:scale-105"
                        style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                        Open
                      </Link>
                    </div>
                  ))}
                  <Link href="/library"
                    className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all hover:bg-opacity-80"
                    style={{ border: '1.5px dashed rgba(32,43,53,0.15)', color: 'rgba(32,43,53,0.5)' }}>
                    <Upload size={15} />
                    Upload a new document
                  </Link>
                </div>
              </SectionCard>
            </motion.div>
          </div>

          {/* Right col: recommendations + weak topics */}
          <div className="space-y-8">

            {/* Recommendations */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={9}>
              <SectionCard title="Recommendations" subtitle="Personalized study plan" icon={Lightbulb}>
                <div className="mt-4 space-y-3">
                  {DEMO_RECOMMENDATIONS.map((rec) => (
                    <div key={rec.id} className="p-3 rounded-xl transition-all hover:-translate-y-0.5"
                      style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.06)' }}>
                      <div className="flex items-start gap-2 mb-1.5">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                          style={{ background: priorityColor[rec.priority] }} />
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-ink)', lineHeight: 1.3 }}>{rec.title}</p>
                      </div>
                      <p className="text-xs pl-3.5 leading-relaxed" style={{ color: 'rgba(32,43,53,0.55)' }}>{rec.description}</p>
                      <div className="flex gap-1 mt-2 pl-3.5">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: rec.type === 'study' ? 'rgba(34,97,146,0.08)' : rec.type === 'practice' ? 'rgba(239,133,87,0.08)' : 'rgba(234,179,8,0.08)',
                            color: rec.type === 'study' ? 'var(--color-editorial-blue)' : rec.type === 'practice' ? 'var(--color-coral)' : '#ca8a04' }}>
                          {rec.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>

            {/* Topics needing attention */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={10}>
              <SectionCard title="Needs Attention" subtitle="Topics to focus on" icon={AlertCircle}>
                <div className="mt-4 space-y-2">
                  {DEMO_TOPICS.filter(t => t.difficultyScore >= 65).map((topic) => (
                    <Link key={topic.id} href="/topics"
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5"
                      style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.06)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: topic.difficultyScore >= 75 ? 'rgba(239,133,87,0.1)' : 'rgba(234,179,8,0.1)' }}>
                        <BookMarked size={14} style={{ color: topic.difficultyScore >= 75 ? 'var(--color-coral)' : '#ca8a04' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{topic.name}</p>
                        <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>Difficulty: {topic.difficultyScore}/100</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: topic.difficultyScore >= 75 ? 'rgba(239,133,87,0.1)' : 'rgba(234,179,8,0.1)',
                          color: topic.difficultyScore >= 75 ? 'var(--color-coral)' : '#ca8a04' }}>
                        {topic.difficultyCategory}
                      </span>
                    </Link>
                  ))}
                  <Link href="/practice"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                    style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                    Practice These Topics <ArrowRight size={14} />
                  </Link>
                </div>
              </SectionCard>
            </motion.div>

            {/* Quick actions */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={11}>
              <div className="rounded-2xl p-5" style={{ background: 'var(--color-editorial-blue)' }}>
                <h3 className="font-bold text-white mb-1">Continue Learning</h3>
                <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>DBMS Study Guide · Chapter 4</p>
                <div className="space-y-2">
                  {[
                    { label: 'Read in Tamil', href: `/learning/demo-dbms-001`, icon: BookOpen },
                    { label: 'Generate Quiz', href: '/practice', icon: Target },
                    { label: 'View Topics', href: '/topics', icon: BarChart2 },
                  ].map((action) => (
                    <Link key={action.label} href={action.href}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
                      <action.icon size={14} />
                      {action.label}
                      <ChevronRight size={12} className="ml-auto opacity-60" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────
function DashboardTopBar() {
  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(234,230,222,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(32,43,53,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-editorial-blue)' }}>
              <BookOpen size={15} className="text-white" />
            </div>
            <span className="font-bold text-base" style={{ color: 'var(--color-ink)' }}>
              LinguaLearn<span style={{ color: 'var(--color-coral)' }}> AI</span>
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Overview', href: '/dashboard', active: true },
            { label: 'Library', href: '/library' },
            { label: 'Learning', href: '/learning/demo-dbms-001' },
            { label: 'Topics', href: '/topics' },
            { label: 'Practice', href: '/practice' },
            { label: 'Progress', href: '/progress' },
            { label: 'Settings', href: '/settings' },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{ background: item.active ? 'var(--color-editorial-blue)' : 'transparent', color: item.active ? 'white' : 'rgba(32,43,53,0.65)' }}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/library" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
          style={{ background: 'var(--color-coral)', color: 'white' }}>
          <Upload size={12} /> Upload
        </Link>
      </div>
    </nav>
  );
}

function SectionCard({ title, subtitle, icon: Icon, href, children }: {
  title: string; subtitle: string; icon: React.ElementType; href?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={15} style={{ color: 'var(--color-editorial-blue)' }} />
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>{title}</h2>
            <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>{subtitle}</p>
          </div>
        </div>
        {href && (
          <Link href={href} className="text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all" style={{ color: 'var(--color-editorial-blue)' }}>
            View all <ArrowRight size={12} />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
