'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Languages, Zap, Eye, Volume2, ChevronLeft, ChevronRight,
  Columns, AlignLeft, Globe, Sparkles, AlertCircle, Loader2,
  Lightbulb, X, ExternalLink, BookMarked, ArrowLeft,
} from 'lucide-react';
import { DEMO_DOCUMENTS } from '@/lib/demo-data/documents';
import { DEMO_TOPICS } from '@/lib/demo-data/topics';
import type { StudyDocument, Translation, SimplifiedContent, Language, LearningLevel, ConceptExplanation } from '@/types';

type ViewMode = 'original' | 'translated' | 'simplified' | 'bilingual';

const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: 'english', label: 'English', native: 'English' },
  { value: 'tamil', label: 'Tamil', native: 'தமிழ்' },
  { value: 'hindi', label: 'Hindi', native: 'हिंदी' },
  { value: 'telugu', label: 'Telugu', native: 'తెలుగు' },
  { value: 'malayalam', label: 'Malayalam', native: 'മലയாളം' },
];

const LEVELS: { value: LearningLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function LearningStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const [docId, setDocId] = useState<string>('');
  const [doc, setDoc] = useState<StudyDocument | null>(null);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('original');
  const [language, setLanguage] = useState<Language>('english');
  const [level, setLevel] = useState<LearningLevel>('intermediate');
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [simplified, setSimplified] = useState<SimplifiedContent | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [conceptPanel, setConceptPanel] = useState<ConceptExplanation | null>(null);
  const [conceptLoading, setConceptLoading] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    params.then(({ id }) => {
      setDocId(id);
      // Load document
      const demoDoc = DEMO_DOCUMENTS.find(d => d.id === id);
      if (demoDoc) { setDoc(demoDoc); return; }
      // Try IndexedDB
      import('@/lib/storage/indexeddb').then(db => db.getDocument(id)).then(d => { if (d) setDoc(d); });
    });
  }, [params]);

  const currentSection = doc?.sections[sectionIdx];

  const handleTranslate = async () => {
    if (!doc || !currentSection) return;
    setAiLoading(true); setAiError(null);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id, sections: doc.sections.slice(0, 6).map(s => ({ id: s.id, title: s.title, content: s.content, order: s.order })), targetLanguage: language }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      setTranslation(data);
      setViewMode('bilingual');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Translation failed');
    } finally { setAiLoading(false); }
  };

  const handleSimplify = async () => {
    if (!doc) return;
    setAiLoading(true); setAiError(null);
    try {
      const res = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id, sections: doc.sections.slice(0, 6).map(s => ({ id: s.id, title: s.title, content: s.content, order: s.order })), level, language }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      setSimplified(data);
      setViewMode('simplified');
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Simplification failed');
    } finally { setAiLoading(false); }
  };

  const handleExplainConcept = async (concept: string) => {
    if (!doc) return;
    setConceptLoading(true);
    try {
      const res = await fetch('/api/explain-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, documentContext: doc.sections.slice(0, 3).map(s => s.content).join('\n'), level, language }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      setConceptPanel(data);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Explanation failed');
    } finally { setConceptLoading(false); }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) { window.speechSynthesis.cancel(); setIsSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'tamil' ? 'ta-IN' : language === 'hindi' ? 'hi-IN' : language === 'telugu' ? 'te-IN' : language === 'malayalam' ? 'ml-IN' : 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const getDisplayText = (): string => {
    if (!currentSection) return '';
    if (viewMode === 'simplified' && simplified) {
      const s = simplified.sections.find(s => s.sectionId === currentSection.id);
      return s?.simplifiedText ?? currentSection.content;
    }
    if ((viewMode === 'translated' || viewMode === 'bilingual') && translation) {
      const s = translation.sections.find(s => s.sectionId === currentSection.id);
      return s?.translatedText ?? currentSection.content;
    }
    return currentSection.content;
  };

  const fontSizeMap = { sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' };

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-ivory)' }}>
        <div className="text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: 'var(--color-editorial-blue)' }} />
          <p style={{ color: 'rgba(32,43,53,0.5)' }}>Loading document…</p>
          <Link href="/library" className="mt-4 inline-flex items-center gap-2 text-sm" style={{ color: 'var(--color-editorial-blue)' }}>
            <ArrowLeft size={14} /> Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const translatedSection = translation?.sections.find(s => s.sectionId === currentSection?.id);
  const simplifiedSection = simplified?.sections.find(s => s.sectionId === currentSection?.id);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-ivory)' }}>
      {/* Top bar */}
      <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(234,230,222,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(32,43,53,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/library" className="flex items-center gap-1 text-sm font-medium" style={{ color: 'rgba(32,43,53,0.5)' }}>
            <ArrowLeft size={14} /> Library
          </Link>
          <div className="h-4 w-px" style={{ background: 'rgba(32,43,53,0.15)' }} />
          <span className="text-sm font-semibold truncate max-w-xs" style={{ color: 'var(--color-ink)' }}>{doc.name}</span>
          {doc.isDemo && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,97,146,0.1)', color: 'var(--color-editorial-blue)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em' }}>DEMO</span>}
          <div className="ml-auto flex items-center gap-2">
            {/* Font size */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)' }}>
              {(['sm', 'base', 'lg', 'xl'] as const).map(fs => (
                <button key={fs} onClick={() => setFontSize(fs)}
                  className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: fontSize === fs ? 'var(--color-editorial-blue)' : 'transparent', color: fontSize === fs ? 'white' : 'rgba(32,43,53,0.4)' }}>
                  A
                </button>
              ))}
            </div>
            <button onClick={() => handleSpeak(getDisplayText())}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: isSpeaking ? 'var(--color-coral)' : 'var(--color-soft-neutral)', color: isSpeaking ? 'white' : 'rgba(32,43,53,0.65)', border: '1px solid rgba(32,43,53,0.08)' }}>
              <Volume2 size={13} /> {isSpeaking ? 'Stop' : 'Read Aloud'}
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 flex gap-8">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden lg:block">
          {/* View mode */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(32,43,53,0.4)' }}>View Mode</p>
            <div className="space-y-1">
              {[
                { mode: 'original' as ViewMode, icon: AlignLeft, label: 'Original' },
                { mode: 'translated' as ViewMode, icon: Globe, label: 'Translation' },
                { mode: 'simplified' as ViewMode, icon: Zap, label: 'Simplified' },
                { mode: 'bilingual' as ViewMode, icon: Columns, label: 'Bilingual' },
              ].map(({ mode, icon: Icon, label }) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{ background: viewMode === mode ? 'var(--color-editorial-blue)' : 'transparent', color: viewMode === mode ? 'white' : 'rgba(32,43,53,0.65)' }}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Language & level */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(32,43,53,0.4)' }}>Language</p>
            <select value={language} onChange={e => setLanguage(e.target.value as Language)}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)', color: 'var(--color-ink)' }}>
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(32,43,53,0.4)' }}>Level</p>
            <select value={level} onChange={e => setLevel(e.target.value as LearningLevel)}
              className="w-full px-3 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)', color: 'var(--color-ink)' }}>
              {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>

          {/* AI actions */}
          <div className="space-y-2">
            <button onClick={handleTranslate} disabled={aiLoading}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
              {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Languages size={14} />}
              Translate
            </button>
            <button onClick={handleSimplify} disabled={aiLoading}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: 'var(--color-coral)', color: 'white' }}>
              {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              Simplify
            </button>
            <Link href="/practice"
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ background: 'var(--color-soft-neutral)', color: 'var(--color-ink)', border: '1px solid rgba(32,43,53,0.08)', display: 'flex' }}>
              <Sparkles size={14} /> Generate Quiz
            </Link>
          </div>

          {/* Sections list */}
          <div className="mt-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'rgba(32,43,53,0.4)' }}>Sections</p>
            <div className="space-y-1">
              {doc.sections.map((sec, i) => (
                <button key={sec.id} onClick={() => setSectionIdx(i)}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                  style={{ background: sectionIdx === i ? 'rgba(239,133,87,0.1)' : 'transparent',
                    color: sectionIdx === i ? 'var(--color-coral)' : 'rgba(32,43,53,0.55)',
                    fontWeight: sectionIdx === i ? 600 : 400, borderLeft: sectionIdx === i ? '2px solid var(--color-coral)' : '2px solid transparent' }}>
                  {sec.title}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main id="main-content" className="flex-1 min-w-0">
          {aiError && (
            <div className="flex items-start gap-2 p-4 rounded-xl mb-4" style={{ background: 'rgba(239,133,87,0.08)', border: '1px solid rgba(239,133,87,0.2)' }}>
              <AlertCircle size={15} style={{ color: 'var(--color-coral)', flexShrink: 0 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-coral)' }}>AI Error</p>
                <p className="text-xs" style={{ color: 'rgba(32,43,53,0.6)' }}>{aiError}</p>
              </div>
              <button onClick={() => setAiError(null)} className="ml-auto"><X size={14} style={{ color: 'rgba(32,43,53,0.4)' }} /></button>
            </div>
          )}

          {/* Section navigation */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: 'rgba(32,43,53,0.4)' }}>
                Section {sectionIdx + 1} of {doc.sections.length}
              </p>
              <h2 className="text-xl font-black" style={{ color: 'var(--color-ink)' }}>{currentSection?.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSectionIdx(Math.max(0, sectionIdx - 1))} disabled={sectionIdx === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)' }}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setSectionIdx(Math.min(doc.sections.length - 1, sectionIdx + 1))} disabled={sectionIdx === doc.sections.length - 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.08)' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            <motion.div key={`${sectionIdx}-${viewMode}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
              {viewMode === 'bilingual' && translation ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div className="rounded-2xl p-6" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                    <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--color-editorial-blue)' }}>English · Original</div>
                    <p className="leading-relaxed whitespace-pre-wrap" style={{ fontSize: fontSizeMap[fontSize], color: 'var(--color-ink)', lineHeight: 1.8 }}>
                      {currentSection?.content}
                    </p>
                  </div>
                  {/* Translated */}
                  <div className="rounded-2xl p-6" style={{ background: 'rgba(34,97,146,0.04)', border: '1px solid rgba(34,97,146,0.12)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-coral)' }}>
                        {LANGUAGES.find(l => l.value === translation.language)?.label} · Translation
                      </span>
                      <button onClick={() => handleSpeak(translatedSection?.translatedText ?? '')}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                        style={{ background: isSpeaking ? 'var(--color-coral)' : 'rgba(239,133,87,0.1)' }}>
                        <Volume2 size={12} style={{ color: isSpeaking ? 'white' : 'var(--color-coral)' }} />
                      </button>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap" style={{ fontSize: fontSizeMap[fontSize], color: 'var(--color-ink)', lineHeight: 1.9, fontFamily: 'sans-serif' }}>
                      {translatedSection?.translatedText ?? 'Translation not available for this section.'}
                    </p>
                    {translatedSection?.technicalTerms && translatedSection.technicalTerms.length > 0 && (
                      <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(34,97,146,0.1)' }}>
                        <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(32,43,53,0.5)' }}>Technical terms preserved in English:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {translatedSection.technicalTerms.map(term => (
                            <span key={term} className="text-xs px-2 py-0.5 rounded-md" style={{ background: 'rgba(239,133,87,0.1)', color: 'var(--color-coral)', fontWeight: 600 }}>{term}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : viewMode === 'simplified' && simplified ? (
                <div className="rounded-2xl p-6" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Zap size={15} style={{ color: 'var(--color-coral)' }} />
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--color-coral)' }}>Simplified · {level}</span>
                    {simplified.isDemo && <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,97,146,0.08)', color: 'var(--color-editorial-blue)' }}>AI Generated</span>}
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap mb-6" style={{ fontSize: fontSizeMap[fontSize], color: 'var(--color-ink)', lineHeight: 1.9 }}>
                    {simplifiedSection?.simplifiedText ?? currentSection?.content}
                  </p>
                  {simplifiedSection?.keyPoints && (
                    <div className="rounded-xl p-4" style={{ background: 'rgba(34,97,146,0.05)', border: '1px solid rgba(34,97,146,0.1)' }}>
                      <p className="text-xs font-bold mb-2" style={{ color: 'var(--color-editorial-blue)' }}>KEY POINTS</p>
                      <ul className="space-y-1.5">
                        {simplifiedSection.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-ink)' }}>
                            <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-coral)' }} />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {simplifiedSection?.analogy && (
                    <div className="mt-4 rounded-xl p-4 flex gap-3" style={{ background: 'rgba(239,133,87,0.06)', border: '1px solid rgba(239,133,87,0.15)' }}>
                      <Lightbulb size={16} style={{ color: 'var(--color-coral)', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-coral)' }}>ANALOGY</p>
                        <p className="text-sm" style={{ color: 'var(--color-ink)' }}>{simplifiedSection.analogy}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl p-6" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                  <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'rgba(32,43,53,0.4)' }}>
                    {viewMode === 'translated' ? `${LANGUAGES.find(l => l.value === language)?.label} Translation` : 'Original Content'}
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap" style={{ fontSize: fontSizeMap[fontSize], color: 'var(--color-ink)', lineHeight: 1.9 }}>
                    {viewMode === 'translated' && translation
                      ? (translatedSection?.translatedText ?? 'Translation not available. Click Translate in the sidebar.')
                      : currentSection?.content}
                  </p>
                  {viewMode === 'translated' && !translation && (
                    <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(34,97,146,0.06)', border: '1px solid rgba(34,97,146,0.1)' }}>
                      <Languages size={14} style={{ color: 'var(--color-editorial-blue)' }} />
                      <span className="text-sm" style={{ color: 'var(--color-editorial-blue)' }}>Click <strong>Translate</strong> in the sidebar to translate this content using Gemini AI.</span>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Glossary */}
          {translation?.glossary && translation.glossary.length > 0 && (
            <div className="mt-6 rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>Technical Glossary</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {translation.glossary.slice(0, 6).map(entry => (
                  <div key={entry.term} className="p-3 rounded-lg" style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.06)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold" style={{ color: 'var(--color-coral)' }}>{entry.term}</span>
                      {entry.transliteration && <span className="text-xs" style={{ color: 'rgba(32,43,53,0.4)', fontFamily: 'sans-serif' }}>({entry.transliteration})</span>}
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(32,43,53,0.6)' }}>{entry.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Concept explanation panel */}
          <AnimatePresence>
            {conceptPanel && (
              <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 32 }}
                className="fixed right-6 top-20 bottom-6 w-80 rounded-2xl overflow-y-auto z-50 shadow-2xl"
                style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.1)' }}>
                <div className="sticky top-0 px-5 py-4 flex items-center justify-between" style={{ background: 'var(--color-editorial-blue)' }}>
                  <span className="font-bold text-white text-sm">{conceptPanel.concept}</span>
                  <button onClick={() => setConceptPanel(null)} className="text-white opacity-70 hover:opacity-100"><X size={16} /></button>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold mb-2" style={{ color: 'var(--color-editorial-blue)' }}>EXPLANATION</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>{conceptPanel.simpleExplanation}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(239,133,87,0.08)', border: '1px solid rgba(239,133,87,0.15)' }}>
                    <p className="text-xs font-bold mb-1" style={{ color: 'var(--color-coral)' }}>ANALOGY</p>
                    <p className="text-sm" style={{ color: 'var(--color-ink)' }}>{conceptPanel.realWorldAnalogy}</p>
                  </div>
                  {conceptPanel.keyPoints.length > 0 && (
                    <div>
                      <p className="text-xs font-bold mb-2" style={{ color: 'var(--color-editorial-blue)' }}>KEY POINTS</p>
                      <ul className="space-y-1.5">
                        {conceptPanel.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--color-ink)' }}>
                            <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-coral)' }} />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="pt-2">
                    <p className="text-xs font-bold mb-2" style={{ color: 'rgba(32,43,53,0.4)' }}>SOURCE</p>
                    <div className="p-3 rounded-lg text-xs italic" style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.06)', color: 'rgba(32,43,53,0.6)' }}>
                      "{conceptPanel.sourceExcerpt}"
                    </div>
                  </div>
                  <Link href="/practice" className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold w-full"
                    style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                    <Sparkles size={14} /> Practice Questions
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
