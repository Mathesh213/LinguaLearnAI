'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, Upload, FileText, X, CheckCircle, AlertCircle, Loader2, ArrowRight, Sparkles, Globe, Zap } from 'lucide-react';
import { DEMO_DOCUMENTS } from '@/lib/demo-data/documents';
import type { StudyDocument, Language, LearningLevel, ProcessingStage } from '@/types';

const ACCEPT_TYPES = ['.pdf', '.docx', '.pptx', '.txt'];
const MAX_SIZE_MB = 20;

const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: 'english', label: 'English', native: 'English' },
  { value: 'tamil', label: 'Tamil', native: 'தமிழ்' },
  { value: 'hindi', label: 'Hindi', native: 'हिंदी' },
  { value: 'telugu', label: 'Telugu', native: 'తెలుగు' },
  { value: 'malayalam', label: 'Malayalam', native: 'മലയാളം' },
];

const LEVELS: { value: LearningLevel; label: string; desc: string }[] = [
  { value: 'beginner', label: 'Beginner', desc: 'Simple vocabulary & real-world analogies' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Technical terms with detailed explanations' },
  { value: 'advanced', label: 'Advanced', desc: 'Full technical depth & formal definitions' },
];

const STAGES: ProcessingStage[] = [
  { id: 's1', label: 'Reading document', status: 'pending' },
  { id: 's2', label: 'Extracting concepts', status: 'pending' },
  { id: 's3', label: 'Understanding context', status: 'pending' },
  { id: 's4', label: 'Preparing translation', status: 'pending' },
  { id: 's5', label: 'Generating learning resources', status: 'pending' },
];

function getFormatFromFile(file: File): 'pdf' | 'docx' | 'pptx' | 'txt' | null {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.docx')) return 'docx';
  if (name.endsWith('.pptx')) return 'pptx';
  if (name.endsWith('.txt')) return 'txt';
  return null;
}

export default function LibraryPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('english');
  const [level, setLevel] = useState<LearningLevel>('intermediate');
  const [processing, setProcessing] = useState(false);
  const [stages, setStages] = useState<ProcessingStage[]>(STAGES);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processedDoc, setProcessedDoc] = useState<StudyDocument | null>(null);

  const validateFile = (file: File): string | null => {
    const fmt = getFormatFromFile(file);
    if (!fmt) return `Unsupported format. Use: ${ACCEPT_TYPES.join(', ')}`;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `File too large. Max ${MAX_SIZE_MB}MB.`;
    return null;
  };

  const handleFile = (file: File) => {
    const err = validateFile(file);
    if (err) { setFileError(err); setSelectedFile(null); return; }
    setFileError(null);
    setSelectedFile(file);
    setProcessedDoc(null);
    setProcessError(null);
    setStages(STAGES.map(s => ({ ...s, status: 'pending' })));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const advanceStage = (stages: ProcessingStage[], activeIdx: number): ProcessingStage[] =>
    stages.map((s, i) => ({
      ...s,
      status: i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending',
    }));

  const handleProcess = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setProcessError(null);

    try {
      // Stage 1: Read
      setStages(s => advanceStage(s, 0));
      await new Promise(r => setTimeout(r, 600));

      const fmt = getFormatFromFile(selectedFile)!;
      let rawText = '';
      let sections: import('@/types').DocumentSection[] = [];
      let pageCount = 1;

      if (fmt === 'txt') {
        const { extractFromTxt } = await import('@/lib/document/txt-extractor');
        const result = await extractFromTxt(selectedFile);
        rawText = result.rawText; sections = result.sections;
      } else if (fmt === 'docx') {
        const { extractFromDocx } = await import('@/lib/document/docx-extractor');
        const result = await extractFromDocx(selectedFile);
        rawText = result.rawText; sections = result.sections;
      } else if (fmt === 'pptx') {
        const { extractFromPptx } = await import('@/lib/document/pptx-extractor');
        const result = await extractFromPptx(selectedFile);
        rawText = result.rawText; sections = result.sections;
      } else if (fmt === 'pdf') {
        const { extractFromPdf } = await import('@/lib/document/pdf-extractor');
        const result = await extractFromPdf(selectedFile);
        rawText = result.rawText; sections = result.sections; pageCount = result.pageCount;
      }

      // Stage 2: Extract
      setStages(s => advanceStage(s, 1));
      await new Promise(r => setTimeout(r, 400));

      // Stage 3: Understand
      setStages(s => advanceStage(s, 2));
      await new Promise(r => setTimeout(r, 400));

      // Stage 4: Prepare
      setStages(s => advanceStage(s, 3));
      await new Promise(r => setTimeout(r, 300));

      // Stage 5: Save
      setStages(s => advanceStage(s, 4));

      const doc: StudyDocument = {
        id: `doc-${Date.now()}`,
        name: selectedFile.name.replace(/\.[^.]+$/, ''),
        format: fmt,
        size: selectedFile.size,
        uploadedAt: new Date(),
        status: 'ready',
        sections,
        rawText,
        pageCount,
        isDemo: false,
      };

      const { saveDocument } = await import('@/lib/storage/indexeddb');
      await saveDocument(doc);

      // All done
      setStages(s => s.map(st => ({ ...st, status: 'done' })));
      await new Promise(r => setTimeout(r, 300));
      setProcessedDoc(doc);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setProcessError(msg);
      setStages(s => s.map((st, i) => ({
        ...st,
        status: st.status === 'active' ? 'error' : st.status,
      })));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-ivory)' }}>
      <LibraryTopBar />

      <main id="main-content" className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--color-coral)' }}>Document Studio</span>
          <h1 className="font-black mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.03em', color: 'var(--color-ink)' }}>
            Transform your{' '}
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', color: 'var(--color-editorial-blue)' }}>learning material.</span>
          </h1>
          <p style={{ color: 'rgba(32,43,53,0.55)' }}>Upload a document to translate, simplify, and generate practice questions using Gemini AI.</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Upload area — 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            {/* Demo documents */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={15} style={{ color: 'var(--color-editorial-blue)' }} />
                <h2 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Demo Documents</h2>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,97,146,0.08)', color: 'var(--color-editorial-blue)' }}>Sample Data</span>
              </div>
              {DEMO_DOCUMENTS.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.06)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,97,146,0.08)' }}>
                    <BookOpen size={16} style={{ color: 'var(--color-editorial-blue)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-ink)' }}>{doc.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>{doc.sections.length} sections · {doc.pageCount} pages · Demo</p>
                  </div>
                  <Link href={`/learning/${doc.id}`}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:scale-105"
                    style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                    Open <ArrowRight size={12} className="inline ml-1" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Drop zone */}
            <div>
              <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--color-ink)' }}>Upload Your Document</h2>
              <div
                onDragEnter={e => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
                onDragOver={e => e.preventDefault()}
                onDrop={onDrop}
                className="relative rounded-2xl transition-all duration-300"
                style={{
                  border: `2px dashed ${dragActive ? 'var(--color-coral)' : selectedFile ? 'var(--color-editorial-blue)' : 'rgba(32,43,53,0.15)'}`,
                  background: dragActive ? 'rgba(239,133,87,0.04)' : selectedFile ? 'rgba(34,97,146,0.03)' : 'transparent',
                  padding: '2.5rem',
                  textAlign: 'center',
                }}
              >
                <input id="file-input" type="file" accept={ACCEPT_TYPES.join(',')} onChange={onInputChange} className="sr-only" />

                {selectedFile ? (
                  <div>
                    <CheckCircle size={28} className="mx-auto mb-3" style={{ color: 'var(--color-editorial-blue)' }} />
                    <p className="font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>{selectedFile.name}</p>
                    <p className="text-sm mb-4" style={{ color: 'rgba(32,43,53,0.5)' }}>{(selectedFile.size / 1024).toFixed(1)} KB</p>
                    <button onClick={() => { setSelectedFile(null); setProcessedDoc(null); setStages(STAGES.map(s => ({ ...s, status: 'pending' }))); }}
                      className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(32,43,53,0.08)', color: 'rgba(32,43,53,0.6)' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload size={28} className="mx-auto mb-3" style={{ color: 'rgba(32,43,53,0.3)' }} />
                    <p className="font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>Drop your document here</p>
                    <p className="text-sm mb-4" style={{ color: 'rgba(32,43,53,0.45)' }}>or browse files</p>
                    <label htmlFor="file-input" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all hover:scale-105"
                      style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                      Browse Files
                    </label>
                    <p className="text-xs mt-4" style={{ color: 'rgba(32,43,53,0.35)' }}>PDF, DOCX, PPTX, TXT · Max {MAX_SIZE_MB}MB</p>
                  </div>
                )}

                {fileError && (
                  <div className="flex items-center gap-2 mt-3 text-sm" style={{ color: 'var(--color-coral)' }}>
                    <AlertCircle size={14} /> {fileError}
                  </div>
                )}
              </div>
            </div>

            {/* Processing stages */}
            <AnimatePresence>
              {processing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--color-ink)' }}>Processing your document…</h3>
                  <div className="space-y-2">
                    {stages.map(stage => (
                      <div key={stage.id} className="flex items-center gap-3 py-2 px-3 rounded-lg"
                        style={{ background: stage.status === 'active' ? 'rgba(34,97,146,0.08)' : stage.status === 'done' ? 'rgba(239,133,87,0.06)' : 'transparent' }}>
                        {stage.status === 'done' ? <CheckCircle size={15} style={{ color: 'var(--color-coral)' }} />
                          : stage.status === 'active' ? <Loader2 size={15} className="animate-spin" style={{ color: 'var(--color-editorial-blue)' }} />
                            : <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: 'rgba(32,43,53,0.2)' }} />}
                        <span className="text-sm" style={{ color: stage.status === 'pending' ? 'rgba(32,43,53,0.4)' : 'var(--color-ink)', fontWeight: stage.status === 'active' ? 600 : 400 }}>
                          {stage.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {processError && (
              <div className="flex items-start gap-2 p-4 rounded-xl" style={{ background: 'rgba(239,133,87,0.08)', border: '1px solid rgba(239,133,87,0.2)' }}>
                <AlertCircle size={16} style={{ color: 'var(--color-coral)', flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-coral)' }}>Processing failed</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(32,43,53,0.6)' }}>{processError}</p>
                </div>
              </div>
            )}

            {/* Success */}
            {processedDoc && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="p-5 rounded-2xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1.5px solid rgba(34,197,94,0.25)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={18} style={{ color: '#16a34a' }} />
                  <span className="font-bold text-sm" style={{ color: '#16a34a' }}>Document ready!</span>
                </div>
                <p className="text-sm mb-4" style={{ color: 'rgba(32,43,53,0.65)' }}>
                  Extracted {processedDoc.sections.length} sections from {processedDoc.name}
                </p>
                <Link href={`/learning/${processedDoc.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: 'var(--color-editorial-blue)', color: 'white' }}>
                  Open Learning Studio <ArrowRight size={15} />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Settings panel — 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Globe size={15} style={{ color: 'var(--color-editorial-blue)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Language</h3>
              </div>
              <div className="space-y-2">
                {LANGUAGES.map(lang => (
                  <button key={lang.value} onClick={() => setLanguage(lang.value)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
                    style={{
                      background: language === lang.value ? 'rgba(34,97,146,0.1)' : 'var(--color-ivory)',
                      border: `1.5px solid ${language === lang.value ? 'rgba(34,97,146,0.3)' : 'rgba(32,43,53,0.06)'}`,
                      color: 'var(--color-ink)',
                    }}>
                    <span className="font-medium">{lang.label}</span>
                    <span className="ml-auto text-xs" style={{ color: 'rgba(32,43,53,0.5)', fontFamily: 'sans-serif' }}>{lang.native}</span>
                    {language === lang.value && <CheckCircle size={14} style={{ color: 'var(--color-editorial-blue)' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={15} style={{ color: 'var(--color-coral)' }} />
                <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>Learning Level</h3>
              </div>
              <div className="space-y-2">
                {LEVELS.map(lv => (
                  <button key={lv.value} onClick={() => setLevel(lv.value)}
                    className="w-full text-left px-3 py-3 rounded-xl transition-all"
                    style={{
                      background: level === lv.value ? 'rgba(239,133,87,0.08)' : 'var(--color-ivory)',
                      border: `1.5px solid ${level === lv.value ? 'rgba(239,133,87,0.3)' : 'rgba(32,43,53,0.06)'}`,
                    }}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{lv.label}</span>
                      {level === lv.value && <CheckCircle size={14} style={{ color: 'var(--color-coral)' }} />}
                    </div>
                    <p className="text-xs" style={{ color: 'rgba(32,43,53,0.5)' }}>{lv.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Transform button */}
            <button
              onClick={handleProcess}
              disabled={!selectedFile || processing}
              className="w-full py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              style={{ background: 'var(--color-editorial-blue)', color: 'white', boxShadow: '0 4px 24px rgba(34,97,146,0.3)' }}>
              {processing ? (
                <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Processing…</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><Zap size={16} /> Transform My Learning Material</span>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function LibraryTopBar() {
  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(234,230,222,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(32,43,53,0.08)' }}>
      <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
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
