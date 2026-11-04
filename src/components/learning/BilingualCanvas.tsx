'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface Section {
  id: string;
  title: string;
  original: string;
  translation: string;
  terms?: Array<{ word: string; meaning: string }>;
}

interface BilingualCanvasProps {
  sections: Section[];
  originalLanguage?: string;
  translationLanguage?: string;
  onTermClick?: (term: string, meaning: string) => void;
}

function highlightTerms(
  text: string,
  terms: Array<{ word: string; meaning: string }>,
  onTermClick?: (term: string, meaning: string) => void,
): React.ReactNode {
  if (!terms || terms.length === 0) return text;

  const sortedTerms = [...terms].sort((a, b) => b.word.length - a.word.length);
  const regex = new RegExp(`(${sortedTerms.map((t) => t.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const term = sortedTerms.find((t) => t.word.toLowerCase() === part.toLowerCase());
    if (term) {
      return (
        <button
          key={i}
          onClick={() => onTermClick?.(term.word, term.meaning)}
          className="text-coral underline underline-offset-2 decoration-dotted hover:text-coral/80 font-medium transition-colors cursor-pointer"
          title={term.meaning}
        >
          {part}
        </button>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function BilingualCanvas({
  sections,
  originalLanguage = 'English',
  translationLanguage = 'Tamil',
  onTermClick,
}: BilingualCanvasProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id ?? '');
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  // Synchronized scrolling
  const syncScroll = (source: 'left' | 'right') => (e: Event) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    const src = source === 'left' ? leftRef.current : rightRef.current;
    const dest = source === 'left' ? rightRef.current : leftRef.current;
    if (src && dest) {
      const ratio = src.scrollTop / (src.scrollHeight - src.clientHeight);
      dest.scrollTop = ratio * (dest.scrollHeight - dest.clientHeight);
    }

    requestAnimationFrame(() => { isSyncing.current = false; });
  };

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    const onLeft = syncScroll('left');
    const onRight = syncScroll('right');
    left.addEventListener('scroll', onLeft, { passive: true });
    right.addEventListener('scroll', onRight, { passive: true });
    return () => {
      left.removeEventListener('scroll', onLeft);
      right.removeEventListener('scroll', onRight);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = leftRef.current?.querySelector(`[data-section="${id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentSection = sections.find((s) => s.id === activeSection);

  return (
    <div className="flex flex-col h-full bg-soft-neutral rounded-2xl overflow-hidden border border-black/8">
      {/* Section Navigation */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-black/8 bg-ivory overflow-x-auto scrollbar-none">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              activeSection === section.id
                ? 'bg-editorial-blue text-white'
                : 'text-ink/50 hover:bg-black/5 hover:text-ink',
            )}
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Bilingual Columns */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Original Column */}
        <div className="flex flex-col flex-1 min-w-0 border-r border-black/8">
          <div className="px-5 py-2.5 bg-ivory border-b border-black/5 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-widest text-editorial-blue/70">
              {originalLanguage}
            </span>
          </div>
          <div ref={leftRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-8">
            {sections.map((section) => (
              <div key={section.id} data-section={section.id}>
                <h3 className="text-ink font-serif font-semibold text-lg mb-3">
                  {section.title}
                </h3>
                <p className="text-ink/80 text-sm leading-7 font-sans">
                  {highlightTerms(section.original, section.terms ?? [], onTermClick)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Translation Column */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="px-5 py-2.5 bg-ivory border-b border-black/5 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-widest text-coral/70">
              {translationLanguage}
            </span>
          </div>
          <div ref={rightRef} className="flex-1 overflow-y-auto px-5 py-5 space-y-8">
            {sections.map((section) => (
              <div key={section.id} data-section={section.id}>
                <h3 className="text-ink font-serif font-semibold text-lg mb-3">
                  {section.title}
                </h3>
                <p className="text-ink/80 text-sm leading-7 font-sans">
                  {section.translation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
