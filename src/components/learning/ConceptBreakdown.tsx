'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, ChevronRight, HelpCircle, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ConceptExplanation } from '@/types';

interface ConceptBreakdownProps {
  concept: ConceptExplanation | null;
  onClose: () => void;
  onAskMore?: (concept: ConceptExplanation) => void;
  onPractice?: (concept: ConceptExplanation) => void;
}

export default function ConceptBreakdown({
  concept,
  onClose,
  onAskMore,
  onPractice,
}: ConceptBreakdownProps) {
  return (
    <AnimatePresence>
      {concept && (
        <>
          {/* Overlay (mobile) */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-40 w-full max-w-sm',
              'bg-ivory border-l border-black/8 shadow-2xl overflow-y-auto',
              'flex flex-col',
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-black/8">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-coral/70 mb-1">
                  Concept
                </p>
                <h2 className="font-serif text-2xl font-bold text-ink leading-tight">
                  {concept.concept}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close concept panel"
                className="shrink-0 mt-1 p-1.5 rounded-lg text-ink/40 hover:text-ink hover:bg-black/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 px-6 py-5 space-y-6">
              {/* Simple Explanation */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-ink/40 mb-2">
                  Simple Explanation
                </h3>
                <p className="text-ink/80 text-sm leading-7">{concept.simpleExplanation}</p>
              </section>

              {/* Analogy */}
              {concept.realWorldAnalogy && (
                <section className="bg-soft-neutral border border-black/8 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={15} className="text-coral" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-coral/80">
                      Real-world Analogy
                    </span>
                  </div>
                  <p className="text-ink/70 text-sm leading-6 italic">{concept.realWorldAnalogy}</p>
                </section>
              )}

              {/* Key Points */}
              {concept.keyPoints && concept.keyPoints.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-ink/40 mb-3">
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {concept.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-ink/75">
                        <ChevronRight
                          size={14}
                          className="text-editorial-blue shrink-0 mt-0.5"
                        />
                        <span className="leading-6">{point}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Related Concepts */}
              {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-ink/40 mb-3">
                    Related Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {concept.relatedConcepts.map((rc) => (
                      <span
                        key={rc}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-editorial-blue/8 text-editorial-blue border border-editorial-blue/15"
                      >
                        {rc}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 pb-6 pt-4 border-t border-black/8 flex flex-col gap-2">
              <button
                onClick={() => onAskMore?.(concept)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-editorial-blue text-white text-sm font-semibold hover:bg-editorial-blue/90 transition-colors"
              >
                <MessageCircle size={15} />
                Ask AI for More
              </button>
              <button
                onClick={() => onPractice?.(concept)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-coral text-coral text-sm font-semibold hover:bg-coral hover:text-white transition-colors"
              >
                <HelpCircle size={15} />
                Practice Questions
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
