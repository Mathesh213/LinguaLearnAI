'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Target, ChevronRight, Zap, Lightbulb, Lock,
  BookMarked, TrendingUp, ArrowRight, X, BarChart2,
} from 'lucide-react';
import { DEMO_TOPICS } from '@/lib/demo-data/topics';
import type { Topic } from '@/types';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const difficultyColor = (cat: string) => {
  if (cat === 'easy') return { bg: 'rgba(34,197,94,0.1)', text: '#16a34a', border: 'rgba(34,197,94,0.25)' };
  if (cat === 'moderate') return { bg: 'rgba(234,179,8,0.1)', text: '#ca8a04', border: 'rgba(234,179,8,0.25)' };
  return { bg: 'rgba(239,133,87,0.1)', text: 'var(--color-coral)', border: 'rgba(239,133,87,0.25)' };
};

const radarData = DEMO_TOPICS.map(t => ({
  topic: t.name.split(' ').slice(0, 2).join(' '),
  score: t.difficultyScore,
}));

export default function TopicsPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [filter, setFilter] = useState<'all' | 'easy' | 'moderate' | 'difficult'>('all');

  const filtered = filter === 'all' ? DEMO_TOPICS : DEMO_TOPICS.filter(t => t.difficultyCategory === filter);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-ivory)' }}>
      <TopicsTopBar />
      <main id="main-content" className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--color-coral)' }}>Topic Intelligence</span>
          <h1 className="font-black mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: 'var(--color-ink)' }}>
            Understand your{' '}
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', color: 'var(--color-editorial-blue)' }}>learning landscape.</span>
          </h1>
          <p style={{ color: 'rgba(32,43,53,0.55)' }}>AI-mapped topics from your document with difficulty scores, prerequisites, and learning paths.</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Topic list */}
          <div className="lg:col-span-2">
            {/* Filter */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium mr-2" style={{ color: 'rgba(32,43,53,0.5)' }}>Filter:</span>
              {(['all', 'easy', 'moderate', 'difficult'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
                  style={{ background: filter === f ? 'var(--color-editorial-blue)' : 'var(--color-soft-neutral)', color: filter === f ? 'white' : 'rgba(32,43,53,0.65)', border: '1px solid rgba(32,43,53,0.08)' }}>
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filtered.map((topic, i) => {
                const dc = difficultyColor(topic.difficultyCategory);
                return (
                  <motion.div key={topic.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                    <button onClick={() => setSelectedTopic(selectedTopic?.id === topic.id ? null : topic)}
                      className="w-full text-left rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ background: 'var(--color-soft-neutral)', border: `1px solid ${selectedTopic?.id === topic.id ? 'rgba(34,97,146,0.3)' : 'rgba(32,43,53,0.06)'}` }}>
                      <div className="flex items-start gap-4">
                        {/* Score ring */}
                        <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                          style={{ background: dc.bg, border: `1.5px solid ${dc.border}` }}>
                          <span className="text-lg font-black" style={{ color: dc.text, lineHeight: 1 }}>{topic.difficultyScore}</span>
                          <span className="text-xs" style={{ color: dc.text }}>/ 100</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-bold" style={{ color: 'var(--color-ink)', fontSize: '1rem' }}>{topic.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-semibold capitalize"
                              style={{ background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>
                              {topic.difficultyCategory}
                            </span>
                          </div>
                          <p className="text-sm mb-3 leading-relaxed" style={{ color: 'rgba(32,43,53,0.6)' }}>{topic.description}</p>
                          <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>
                            <span className="flex items-center gap-1"><BookMarked size={12} /> {topic.subtopics.length} subtopics</span>
                            <span className="flex items-center gap-1"><Target size={12} /> {topic.recommendedLevel}</span>
                            {topic.prerequisites.length > 0 && (
                              <span className="flex items-center gap-1"><Lock size={12} /> {topic.prerequisites.length} prerequisite{topic.prerequisites.length > 1 ? 's' : ''}</span>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'rgba(32,43,53,0.3)', flexShrink: 0, transform: selectedTopic?.id === topic.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {selectedTopic?.id === topic.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                            className="overflow-hidden">
                            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(32,43,53,0.08)' }}>
                              <div className="grid sm:grid-cols-2 gap-4">
                                {/* Subtopics */}
                                <div>
                                  <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--color-editorial-blue)' }}>Subtopics</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {topic.subtopics.map(st => (
                                      <span key={st} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(34,97,146,0.08)', color: 'var(--color-editorial-blue)' }}>{st}</span>
                                    ))}
                                  </div>
                                </div>
                                {/* Key terms */}
                                <div>
                                  <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--color-coral)' }}>Key Terminology</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {topic.keyTerminology.map(term => (
                                      <span key={term} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(239,133,87,0.08)', color: 'var(--color-coral)' }}>{term}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              {/* Prerequisites */}
                              {topic.prerequisites.length > 0 && (
                                <div className="mt-4">
                                  <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(32,43,53,0.4)' }}>Prerequisites</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {topic.prerequisites.map(p => (
                                      <span key={p} className="text-xs px-2 py-0.5 rounded-md flex items-center gap-1" style={{ background: 'rgba(32,43,53,0.06)', color: 'rgba(32,43,53,0.6)' }}>
                                        <Lock size={10} /> {p}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-2 mt-4">
                                <Link href={`/learning/demo-dbms-001`}
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                                  style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                                  <BookOpen size={12} /> Read Content
                                </Link>
                                <Link href="/practice"
                                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                                  style={{ background: 'var(--color-coral)', color: 'white' }}>
                                  <Zap size={12} /> Practice
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: radar chart + summary */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={15} style={{ color: 'var(--color-editorial-blue)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Difficulty Overview</h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(32,43,53,0.1)" />
                    <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10, fill: 'rgba(32,43,53,0.5)' }} />
                    <Radar dataKey="score" fill="var(--color-editorial-blue)" fillOpacity={0.25} stroke="var(--color-editorial-blue)" strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Learning path */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl p-5" style={{ background: 'var(--color-editorial-blue)' }}>
              <h3 className="font-bold text-white mb-1 text-sm">Recommended Learning Path</h3>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>Study these topics in order</p>
              <div className="space-y-2">
                {DEMO_TOPICS.sort((a, b) => a.difficultyScore - b.difficultyScore).map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>{i + 1}</span>
                    <span className="text-xs text-white flex-1 truncate">{t.name}</span>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.difficultyScore}</span>
                  </div>
                ))}
              </div>
              <Link href="/practice" className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl text-xs font-semibold w-full transition-all hover:scale-[1.02]"
                style={{ background: 'var(--color-coral)', color: 'white' }}>
                Start Practicing <ArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TopicsTopBar() {
  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(234,230,222,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(32,43,53,0.08)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-editorial-blue)' }}>
            <BookOpen size={15} className="text-white" />
          </div>
          <span className="font-bold" style={{ color: 'var(--color-ink)' }}>LinguaLearn<span style={{ color: 'var(--color-coral)' }}> AI</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'rgba(32,43,53,0.65)' }}>Dashboard</Link>
          <Link href="/learning/demo-dbms-001" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'rgba(32,43,53,0.65)' }}>Learning</Link>
          <Link href="/practice" className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-coral)', color: 'white' }}>Practice</Link>
        </div>
      </div>
    </nav>
  );
}
