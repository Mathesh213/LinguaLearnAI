'use client';

import { motion } from 'framer-motion';
import { FileText, ExternalLink, Languages, HelpCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Badge from '@/components/ui/Badge';
import type { StudyDocument } from '@/types';

type DocumentFormat = 'PDF' | 'DOCX' | 'PPTX' | 'TXT';
type DocumentStatus = 'ready' | 'processing' | 'error';

interface DocumentCardProps {
  document: StudyDocument;
  onOpen?: (doc: StudyDocument) => void;
  onTranslate?: (doc: StudyDocument) => void;
  onQuiz?: (doc: StudyDocument) => void;
}

const formatColors: Record<DocumentFormat, string> = {
  PDF: 'bg-red-100 text-red-700',
  DOCX: 'bg-blue-100 text-blue-700',
  PPTX: 'bg-orange-100 text-orange-700',
  TXT: 'bg-gray-100 text-gray-700',
};

const statusConfig: Record<
  DocumentStatus,
  { label: string; dot: string; text: string }
> = {
  ready: { label: 'Ready', dot: 'bg-emerald-400', text: 'text-emerald-700' },
  processing: { label: 'Processing', dot: 'bg-amber-400 animate-pulse', text: 'text-amber-700' },
  error: { label: 'Error', dot: 'bg-red-400', text: 'text-red-700' },
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function DocumentCard({ document, onOpen, onTranslate, onQuiz }: DocumentCardProps) {
  const format = (document.format?.toUpperCase() as DocumentFormat) ?? 'PDF';
  const status = (document.status as DocumentStatus) ?? 'ready';
  const sc = statusConfig[status];
  const fc = formatColors[format] ?? 'bg-gray-100 text-gray-700';

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.2 }}
      className="bg-ivory border border-black/8 rounded-2xl p-5 flex flex-col gap-4"
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-editorial-blue/8 flex items-center justify-center">
            <FileText size={20} className="text-editorial-blue" />
          </div>
          <div className="min-w-0">
            <h3 className="text-ink font-semibold text-sm leading-snug line-clamp-2">
              {document.name}
            </h3>
            <p className="text-ink/40 text-xs mt-0.5">
              {document.pageCount ? `${document.pageCount} pages · ` : ''}
              {document.uploadedAt instanceof Date
                ? document.uploadedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : String(document.uploadedAt ?? '')}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', fc)}>
            {format}
          </span>
          {document.isDemo && (
            <Badge variant="demo" size="sm">
              <Star size={10} className="mr-1" />
              Demo
            </Badge>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <span className={cn('w-2 h-2 rounded-full shrink-0', sc.dot)} />
        <span className={cn('text-xs font-medium', sc.text)}>{sc.label}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-auto pt-1 border-t border-black/5">
        <button
          onClick={() => onOpen?.(document)}
          disabled={status !== 'ready'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-editorial-blue hover:bg-editorial-blue/8 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ExternalLink size={13} />
          Open
        </button>
        <div className="w-px h-5 bg-black/8" />
        <button
          onClick={() => onTranslate?.(document)}
          disabled={status !== 'ready'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-ink/60 hover:bg-black/5 hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Languages size={13} />
          Translate
        </button>
        <div className="w-px h-5 bg-black/8" />
        <button
          onClick={() => onQuiz?.(document)}
          disabled={status !== 'ready'}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-coral hover:bg-coral/8 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <HelpCircle size={13} />
          Quiz
        </button>
      </div>
    </motion.div>
  );
}
