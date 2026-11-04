'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Languages, Brain, Zap, ChevronRight, ArrowRight,
  FileText, MessageSquare, Target, Award, Globe, Volume2,
  CheckCircle, Sparkles, BarChart2, Upload, Eye, Star,
  Play, Mic, BookMarked, Lightbulb, Shield, Accessibility,
  Menu, X
} from 'lucide-react';

// ── Bilingual Preview Data ──────────────────────────────────────────────────
const BILINGUAL_PREVIEW = {
  english: {
    heading: 'Normalization',
    text: 'Normalization is the process of organizing data in a relational database to reduce redundancy and improve data integrity. It involves decomposing tables into smaller, well-structured tables.',
    term: 'Normalization',
  },
  tamil: {
    heading: 'நார்மலைசேஷன்',
    text: 'நார்மலைசேஷன் என்பது தரவுத்தளத்தில் தேவையற்ற தரவு மறுபதிவைக் குறைப்பதற்காக தரவுகளை ஒழுங்குபடுத்தும் செயல்முறையாகும். இது அட்டவணைகளை சிறிய, நன்கு கட்டமைக்கப்பட்ட அட்டவணைகளாக பிரிக்கிறது.',
    term: 'நார்மலைசேஷன்',
  },
};

// ── How it works steps ─────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload your material',
    desc: 'PDF, DOCX, PPTX or plain text — drop it in and our system processes it instantly.',
    icon: Upload,
    color: 'bg-editorial-blue',
  },
  {
    step: '02',
    title: 'AI understands the content',
    desc: 'Gemini AI extracts topics, identifies technical terms, and maps the knowledge structure.',
    icon: Brain,
    color: 'bg-coral',
  },
  {
    step: '03',
    title: 'Select your language & level',
    desc: 'Choose from Tamil, Hindi, Telugu, Malayalam, or English. Set your learning level.',
    icon: Languages,
    color: 'bg-editorial-blue',
  },
  {
    step: '04',
    title: 'Learn, Practice, Master',
    desc: 'Read translated content, take AI-generated quizzes, and track your progress over time.',
    icon: Award,
    color: 'bg-coral',
  },
];

// ── Core capabilities ───────────────────────────────────────────────────────
const CAPABILITIES = [
  {
    icon: Languages,
    title: 'Context-Aware Translation',
    desc: 'Preserves technical terminology, formulas, and educational meaning across 5 Indian languages.',
    accent: 'coral',
  },
  {
    icon: Lightbulb,
    title: 'Intelligent Simplification',
    desc: 'Three learning levels — Beginner, Intermediate, Advanced — each with concept-preservation checks.',
    accent: 'blue',
  },
  {
    icon: Brain,
    title: 'Topic Intelligence',
    desc: 'AI maps difficulty scores (0–100), prerequisites, and learning paths from your material.',
    accent: 'coral',
  },
  {
    icon: Target,
    title: 'Source-Verified Questions',
    desc: 'Every practice question traces back to your uploaded content. No hallucinated facts.',
    accent: 'blue',
  },
  {
    icon: Volume2,
    title: 'Multilingual Voice',
    desc: 'Text-to-speech for translated content. Listen while you study in your language.',
    accent: 'coral',
  },
  {
    icon: Accessibility,
    title: 'Full Accessibility',
    desc: 'Dyslexia-friendly fonts, high contrast, font size controls, keyboard navigation.',
    accent: 'blue',
  },
];

// ── Languages ───────────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', sample: 'கற்றல் வரம்பற்றது' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', sample: 'सीखने की कोई सीमा नहीं' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', sample: 'నేర్చుకోవడానికి హద్దులు లేవు' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', sample: 'പഠിക്കാൻ പരിധിയില്ല' },
  { code: 'en', name: 'English', native: 'English', sample: 'Learning has no limits' },
];

// ── Quiz preview ───────────────────────────────────────────────────────────
const QUIZ_PREVIEW_QUESTION = {
  question: 'What is the primary purpose of normalization in a relational database?',
  options: [
    'To increase data redundancy',
    'To reduce redundancy and improve data integrity',
    'To speed up query execution only',
    'To encrypt sensitive data',
  ],
  correct: 1,
  source: 'Chapter 4: Database Normalization — Section 4.1',
};

// ── Fade in variant ─────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0, 0, 0.2, 1] },
  }),
};


export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [activeLang, setActiveLang] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLang((prev) => (prev + 1) % LANGUAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-ivory)' }}>

      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(234,230,222,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(32,43,53,0.08)' : 'none',
        }}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-editorial-blue)' }}
              >
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--color-ink)' }}>
                LinguaLearn
                <span style={{ color: 'var(--color-coral)' }}> AI</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Languages'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: 'var(--color-ink)' }}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  background: 'var(--color-editorial-blue)',
                  color: 'white',
                }}
              >
                Start Learning
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: 'var(--color-ivory)', borderTop: '1px solid rgba(32,43,53,0.08)' }}
            >
              <div className="section-container py-4 flex flex-col gap-4">
                {['Features', 'How It Works', 'Languages'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sm font-medium py-2"
                    style={{ color: 'var(--color-ink)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold px-5 py-3 rounded-full text-center"
                  style={{ background: 'var(--color-editorial-blue)', color: 'white' }}
                >
                  Start Learning
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background decoration */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(34,97,146,0.06) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(239,133,87,0.06) 0%, transparent 50%)
            `,
          }}
        />

        {/* Large editorial BG text */}
        <div
          className="absolute -right-16 top-1/4 text-9xl font-black select-none pointer-events-none hidden lg:block"
          style={{
            color: 'rgba(34,97,146,0.04)',
            fontFamily: 'var(--font-serif)',
            fontSize: '18rem',
            lineHeight: 1,
          }}
        >
          AI
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="section-container relative z-10 py-20"
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Headline */}
            <div>
              {/* Demo label */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="inline-flex items-center gap-2 mb-8"
              >
                <span
                  className="demo-badge"
                  style={{ background: 'rgba(239,133,87,0.1)', borderColor: 'rgba(239,133,87,0.3)', color: 'var(--color-coral)' }}
                >
                  <Sparkles size={10} />
                  Powered by Google Gemini AI
                </span>
              </motion.div>

              {/* Main headline */}
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="editorial-hero mb-6"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.0, letterSpacing: '-0.03em' }}
              >
                <span style={{ color: 'var(--color-ink)' }}>Learning Has </span>
                <br />
                <span
                  style={{
                    fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                    fontStyle: 'italic',
                    fontWeight: 600,
                    color: 'var(--color-editorial-blue)',
                  }}
                >
                  No Language
                </span>
                <br />
                <span style={{ color: 'var(--color-ink)' }}>Barrier.</span>
              </motion.h1>

              {/* Supporting copy */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-lg md:text-xl mb-10 leading-relaxed max-w-lg"
                style={{ color: 'rgba(32,43,53,0.65)', fontWeight: 400 }}
              >
                Transform your study material into personalized learning experiences in your own language.
                Understand difficult concepts, practice intelligently and{' '}
                <em style={{ color: 'var(--color-coral)', fontStyle: 'italic' }}>learn without limits.</em>
              </motion.p>

              {/* CTAs */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href="/dashboard"
                  id="hero-start-learning-btn"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{
                    background: 'var(--color-editorial-blue)',
                    color: 'white',
                    boxShadow: '0 4px 24px rgba(34,97,146,0.3)',
                  }}
                >
                  Start Learning <ArrowRight size={18} />
                </Link>
                <Link
                  href="/library"
                  id="hero-explore-btn"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full font-semibold text-base transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'transparent',
                    color: 'var(--color-ink)',
                    border: '1.5px solid rgba(32,43,53,0.2)',
                  }}
                >
                  <Play size={16} style={{ fill: 'currentColor' }} />
                  Explore the Experience
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="flex gap-8 mt-12 pt-8"
                style={{ borderTop: '1px solid rgba(32,43,53,0.08)' }}
              >
                {[
                  { number: '5', label: 'Languages' },
                  { number: '3', label: 'Learning Levels' },
                  { number: '100%', label: 'Source-Verified' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="text-2xl font-black mb-0.5"
                      style={{ color: 'var(--color-editorial-blue)' }}
                    >
                      {stat.number}
                    </div>
                    <div className="text-xs font-medium" style={{ color: 'rgba(32,43,53,0.5)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Bilingual preview card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: 'var(--color-soft-neutral)',
                  border: '1px solid rgba(32,43,53,0.08)',
                  boxShadow: 'var(--shadow-editorial)',
                }}
              >
                {/* Header */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{
                    background: 'var(--color-editorial-blue)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-white opacity-80" />
                    <span className="text-sm font-semibold text-white opacity-90">
                      Bilingual Learning Canvas
                    </span>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    Live Demo
                  </span>
                </div>

                {/* Two-column bilingual */}
                <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'rgba(32,43,53,0.08)' }}>
                  {/* English */}
                  <div className="p-5">
                    <div
                      className="editorial-label mb-3"
                      style={{ color: 'var(--color-editorial-blue)', fontSize: '0.65rem' }}
                    >
                      English
                    </div>
                    <h3
                      className="text-base font-bold mb-2"
                      style={{ color: 'var(--color-ink)' }}
                    >
                      {BILINGUAL_PREVIEW.english.heading}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'rgba(32,43,53,0.7)' }}
                    >
                      {BILINGUAL_PREVIEW.english.text.split('Normalization').map((part, i, arr) =>
                        i < arr.length - 1 ? (
                          <span key={i}>
                            {part}
                            <mark
                              style={{
                                background: 'rgba(239,133,87,0.2)',
                                color: 'var(--color-coral)',
                                padding: '1px 3px',
                                borderRadius: '2px',
                                fontWeight: 600,
                              }}
                            >
                              Normalization
                            </mark>
                          </span>
                        ) : (
                          part
                        )
                      )}
                    </p>
                  </div>

                  {/* Tamil */}
                  <div className="p-5" style={{ background: 'rgba(34,97,146,0.03)' }}>
                    <div
                      className="editorial-label mb-3"
                      style={{ color: 'var(--color-coral)', fontSize: '0.65rem' }}
                    >
                      Tamil · தமிழ்
                    </div>
                    <h3
                      className="text-base font-bold mb-2"
                      style={{ color: 'var(--color-ink)', fontFamily: 'sans-serif' }}
                    >
                      {BILINGUAL_PREVIEW.tamil.heading}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'rgba(32,43,53,0.7)', fontFamily: 'sans-serif' }}
                    >
                      {BILINGUAL_PREVIEW.tamil.text}
                    </p>
                  </div>
                </div>

                {/* Glossary strip */}
                <div
                  className="px-5 py-3 flex items-center gap-4"
                  style={{ borderTop: '1px solid rgba(32,43,53,0.06)', background: 'rgba(32,43,53,0.02)' }}
                >
                  <span className="editorial-label" style={{ color: 'rgba(32,43,53,0.4)', fontSize: '0.6rem' }}>
                    Glossary
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {['Normalization', 'Redundancy', 'Integrity'].map((term) => (
                      <span
                        key={term}
                        className="text-xs px-2 py-0.5 rounded-md font-medium"
                        style={{
                          background: 'rgba(239,133,87,0.12)',
                          color: 'var(--color-coral)',
                          border: '1px solid rgba(239,133,87,0.2)',
                        }}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Audio indicator */}
                <div
                  className="px-5 py-3 flex items-center justify-between"
                  style={{ borderTop: '1px solid rgba(32,43,53,0.06)' }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                      style={{ background: 'var(--color-coral)' }}
                    >
                      <Volume2 size={12} className="text-white" />
                    </div>
                    <span className="text-xs" style={{ color: 'rgba(32,43,53,0.5)' }}>
                      Listen in Tamil
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[3, 5, 4, 6, 3, 5, 4].map((h, i) => (
                      <div
                        key={i}
                        className="rounded-full animate-pulse-soft"
                        style={{
                          width: '3px',
                          height: `${h * 2}px`,
                          background: 'var(--color-coral)',
                          opacity: 0.6,
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <span className="editorial-label" style={{ color: 'rgba(32,43,53,0.3)', fontSize: '0.6rem' }}>
            Scroll
          </span>
          <div
            className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: 'rgba(32,43,53,0.2)' }}
          >
            <div
              className="w-1 h-2 rounded-full"
              style={{ background: 'var(--color-editorial-blue)' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 md:py-32" style={{ background: 'var(--color-soft-neutral)' }}>
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <span className="editorial-label mb-4 block" style={{ color: 'var(--color-coral)' }}>
              The Process
            </span>
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{ letterSpacing: '-0.03em', color: 'var(--color-ink)' }}
            >
              From upload to mastery{' '}
              <span
                style={{
                  fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                  fontStyle: 'italic',
                  color: 'var(--color-editorial-blue)',
                }}
              >
                in minutes.
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(32,43,53,0.6)' }}>
              A seamless workflow that takes your study material and transforms it into a personalized, multilingual learning experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="relative"
              >
                {/* Connector line (desktop) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div
                    className="absolute top-8 left-full w-full h-px hidden lg:block"
                    style={{
                      background: 'linear-gradient(90deg, rgba(34,97,146,0.3), transparent)',
                      zIndex: 0,
                    }}
                  />
                )}

                <div
                  className="relative rounded-2xl p-6 h-full"
                  style={{
                    background: 'var(--color-ivory)',
                    border: '1px solid rgba(32,43,53,0.06)',
                    boxShadow: 'var(--shadow-soft)',
                  }}
                >
                  <div
                    className="text-xs font-black mb-4"
                    style={{ color: 'rgba(32,43,53,0.2)', fontSize: '0.65rem', letterSpacing: '0.15em' }}
                  >
                    STEP {step.step}
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5`}
                    style={{
                      background: step.color === 'bg-coral' ? 'rgba(239,133,87,0.12)' : 'rgba(34,97,146,0.1)',
                    }}
                  >
                    <step.icon
                      size={22}
                      style={{
                        color: step.color === 'bg-coral' ? 'var(--color-coral)' : 'var(--color-editorial-blue)',
                      }}
                    />
                  </div>

                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--color-ink)' }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(32,43,53,0.6)' }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE CAPABILITIES ────────────────────────────────────────────── */}
      <section id="features" className="py-24 md:py-32">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Title */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:sticky lg:top-24"
            >
              <span className="editorial-label mb-4 block" style={{ color: 'var(--color-editorial-blue)' }}>
                Capabilities
              </span>
              <h2
                className="text-4xl md:text-5xl font-black mb-6"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
              >
                Everything a{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-coral)',
                  }}
                >
                  multilingual
                </span>{' '}
                learner needs.
              </h2>
              <p className="text-lg mb-8" style={{ color: 'rgba(32,43,53,0.6)', lineHeight: 1.7 }}>
                LinguaLearn AI is built for students who deserve education in their mother tongue without sacrificing educational depth or technical accuracy.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
                style={{ background: 'var(--color-coral)', color: 'white' }}
              >
                Start for Free <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Right: Capability grid */}
            <div className="grid sm:grid-cols-2 gap-5">
              {CAPABILITIES.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.5}
                  className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: 'var(--color-soft-neutral)',
                    border: '1px solid rgba(32,43,53,0.06)',
                    cursor: 'default',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      background: cap.accent === 'coral' ? 'rgba(239,133,87,0.1)' : 'rgba(34,97,146,0.08)',
                    }}
                  >
                    <cap.icon
                      size={18}
                      style={{
                        color: cap.accent === 'coral' ? 'var(--color-coral)' : 'var(--color-editorial-blue)',
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--color-ink)' }}>
                    {cap.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(32,43,53,0.6)' }}>
                    {cap.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MULTILINGUAL SHOWCASE ─────────────────────────────────────────── */}
      <section
        id="languages"
        className="py-24 md:py-32"
        style={{
          background: 'var(--color-editorial-blue)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* BG decoration */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 90% 10%, rgba(239,133,87,0.15) 0%, transparent 60%)',
          }}
        />

        <div className="section-container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="editorial-label mb-4 block" style={{ color: 'rgba(239,133,87,0.8)' }}>
              Languages
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-white mb-4"
              style={{ letterSpacing: '-0.03em' }}
            >
              Learn in your{' '}
              <span
                style={{
                  fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                  fontStyle: 'italic',
                  color: 'var(--color-coral)',
                }}
              >
                mother tongue.
              </span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Supporting 5 languages with context-aware translation that preserves educational meaning.
            </p>
          </motion.div>

          {/* Language cards */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {LANGUAGES.map((lang, i) => (
              <motion.button
                key={lang.code}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                onClick={() => setActiveLang(i)}
                className="rounded-2xl p-5 text-left transition-all duration-300 cursor-pointer"
                style={{
                  background:
                    activeLang === i
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(255,255,255,0.06)',
                  border:
                    activeLang === i
                      ? '1.5px solid rgba(255,255,255,0.4)'
                      : '1.5px solid rgba(255,255,255,0.1)',
                  minWidth: '140px',
                  transform: activeLang === i ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: activeLang === i ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                <div className="text-2xl mb-2">{lang.native}</div>
                <div className="text-sm font-semibold text-white mb-1">{lang.name}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {lang.code.toUpperCase()}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Active language sample */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLang}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div
                className="rounded-2xl px-8 py-6"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <p
                  className="text-2xl md:text-3xl font-semibold text-white mb-3"
                  style={{ fontFamily: 'sans-serif', letterSpacing: '0.01em', lineHeight: 1.5 }}
                >
                  &ldquo;{LANGUAGES[activeLang].sample}&rdquo;
                </p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  &ldquo;Learning has no limits&rdquo; in {LANGUAGES[activeLang].name}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TOPIC INTELLIGENCE ───────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: 'var(--color-soft-neutral)' }}>
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: topic difficulty visualization */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: 'var(--color-ivory)',
                  border: '1px solid rgba(32,43,53,0.08)',
                  boxShadow: 'var(--shadow-editorial)',
                }}
              >
                <div
                  className="px-6 py-4 flex items-center gap-3"
                  style={{ borderBottom: '1px solid rgba(32,43,53,0.06)' }}
                >
                  <Brain size={16} style={{ color: 'var(--color-editorial-blue)' }} />
                  <span className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>
                    Topic Difficulty Analysis — DBMS
                  </span>
                  <span className="ml-auto demo-badge">Demo</span>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { topic: 'Database Fundamentals', score: 22, level: 'easy' },
                    { topic: 'Relational Model', score: 45, level: 'moderate' },
                    { topic: 'Database Keys', score: 55, level: 'moderate' },
                    { topic: 'Functional Dependencies', score: 72, level: 'difficult' },
                    { topic: 'Normalization', score: 81, level: 'difficult' },
                    { topic: 'Transactions & ACID', score: 68, level: 'difficult' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.topic}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i * 0.3}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                          {item.topic}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background:
                                item.level === 'easy'
                                  ? 'rgba(34,197,94,0.1)'
                                  : item.level === 'moderate'
                                  ? 'rgba(234,179,8,0.1)'
                                  : 'rgba(239,133,87,0.1)',
                              color:
                                item.level === 'easy'
                                  ? '#16a34a'
                                  : item.level === 'moderate'
                                  ? '#ca8a04'
                                  : 'var(--color-coral)',
                            }}
                          >
                            {item.score}
                          </span>
                        </div>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(32,43,53,0.08)' }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          style={{
                            background:
                              item.level === 'easy'
                                ? '#22c55e'
                                : item.level === 'moderate'
                                ? '#eab308'
                                : 'var(--color-coral)',
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: description */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <span className="editorial-label mb-4 block" style={{ color: 'var(--color-coral)' }}>
                Topic Intelligence
              </span>
              <h2
                className="text-4xl md:text-5xl font-black mb-6"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
              >
                Know exactly{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-editorial-blue)',
                  }}
                >
                  what to study
                </span>{' '}
                next.
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(32,43,53,0.65)' }}>
                Our AI analyzes your uploaded material and assigns difficulty scores (0–100) to every topic, identifies prerequisites, and tells you which concepts need more attention.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Target, text: 'Difficulty scoring based on content complexity' },
                  { icon: Zap, text: 'Weak area detection from quiz performance' },
                  { icon: BookMarked, text: 'Prerequisite mapping for structured learning' },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(239,133,87,0.1)' }}
                    >
                      <item.icon size={15} style={{ color: 'var(--color-coral)' }} />
                    </div>
                    <span className="text-sm leading-relaxed pt-1" style={{ color: 'var(--color-ink)' }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AI PRACTICE PREVIEW ────────────────────────────────────────────── */}
      <section className="py-24 md:py-32">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: description */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:order-2"
            >
              <span className="editorial-label mb-4 block" style={{ color: 'var(--color-editorial-blue)' }}>
                Practice Arena
              </span>
              <h2
                className="text-4xl md:text-5xl font-black mb-6"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.05 }}
              >
                Questions built{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-coral)',
                  }}
                >
                  from your material.
                </span>
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(32,43,53,0.65)' }}>
                Every question is grounded in your uploaded content — not generic textbook questions. After each answer, see the exact source section it came from.
              </p>
              <div className="space-y-4">
                {[
                  { text: 'MCQ, Fill-in-the-blank, Short answer' },
                  { text: 'Source section reference for every question' },
                  { text: 'Detailed AI explanations for wrong answers' },
                  { text: 'Post-quiz recommendations and weak concept detection' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <CheckCircle size={16} style={{ color: 'var(--color-coral)', flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: 'var(--color-ink)' }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: quiz card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="lg:order-1"
            >
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: 'var(--color-soft-neutral)',
                  border: '1px solid rgba(32,43,53,0.08)',
                  boxShadow: 'var(--shadow-editorial)',
                }}
              >
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(32,43,53,0.06)' }}
                >
                  <div className="flex items-center gap-2">
                    <Target size={15} style={{ color: 'var(--color-editorial-blue)' }} />
                    <span className="font-semibold text-sm" style={{ color: 'var(--color-ink)' }}>
                      Practice Question
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(234,179,8,0.1)', color: '#ca8a04' }}
                    >
                      Moderate
                    </span>
                    <span className="demo-badge">Demo</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-semibold text-base mb-5" style={{ color: 'var(--color-ink)' }}>
                    {QUIZ_PREVIEW_QUESTION.question}
                  </p>
                  <div className="space-y-3 mb-5">
                    {QUIZ_PREVIEW_QUESTION.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedAnswer(i)}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                          background:
                            selectedAnswer === i
                              ? selectedAnswer === QUIZ_PREVIEW_QUESTION.correct
                                ? 'rgba(34,197,94,0.1)'
                                : 'rgba(239,133,87,0.1)'
                              : 'var(--color-ivory)',
                          border:
                            selectedAnswer === i
                              ? selectedAnswer === QUIZ_PREVIEW_QUESTION.correct
                                ? '1.5px solid rgba(34,197,94,0.4)'
                                : '1.5px solid rgba(239,133,87,0.4)'
                              : '1.5px solid rgba(32,43,53,0.08)',
                          color:
                            selectedAnswer === i
                              ? selectedAnswer === QUIZ_PREVIEW_QUESTION.correct
                                ? '#16a34a'
                                : 'var(--color-coral)'
                              : 'var(--color-ink)',
                          transform: selectedAnswer === i ? 'scale(1.01)' : 'scale(1)',
                          cursor: 'pointer',
                        }}
                      >
                        <span className="font-bold mr-2" style={{ color: 'rgba(32,43,53,0.3)' }}>
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>

                  {/* Source reference */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(34,97,146,0.06)' }}
                  >
                    <BookOpen size={12} style={{ color: 'var(--color-editorial-blue)', flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: 'var(--color-editorial-blue)' }}>
                      Source: {QUIZ_PREVIEW_QUESTION.source}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ACCESSIBILITY FEATURES ───────────────────────────────────────── */}
      <section
        className="py-24 md:py-32"
        style={{ background: 'var(--color-soft-neutral)' }}
      >
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <span className="editorial-label mb-4 block" style={{ color: 'var(--color-coral)' }}>
              Accessibility First
            </span>
            <h2
              className="text-4xl md:text-5xl font-black mb-4"
              style={{ letterSpacing: '-0.03em' }}
            >
              Designed for{' '}
              <span
                style={{
                  fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                  fontStyle: 'italic',
                  color: 'var(--color-editorial-blue)',
                }}
              >
                every learner.
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(32,43,53,0.6)' }}>
              Inclusive by design. Every feature is built with accessibility, usability, and regional language support at its core.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Volume2,
                title: 'Text-to-Speech',
                desc: 'Listen to translated content in Tamil, Hindi, Telugu, and more using browser speech synthesis.',
              },
              {
                icon: Eye,
                title: 'Reading Mode',
                desc: 'Distraction-free reading with optimized typography, line spacing, and background.',
              },
              {
                icon: Accessibility,
                title: 'Dyslexia-Friendly',
                desc: 'OpenDyslexic font, increased letter spacing, and line height adjustments for easier reading.',
              },
              {
                icon: Shield,
                title: 'High Contrast',
                desc: 'Full high-contrast mode for users with visual impairments or those studying in bright environments.',
              },
              {
                icon: FileText,
                title: 'Adjustable Font Size',
                desc: 'Four size levels from Small to XL. Persists across sessions.',
              },
              {
                icon: Globe,
                title: 'Keyboard Navigation',
                desc: 'Complete keyboard navigation support with accessible labels and ARIA attributes.',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.3}
                className="rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-md"
                style={{
                  background: 'var(--color-ivory)',
                  border: '1px solid rgba(32,43,53,0.06)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    background: i % 2 === 0 ? 'rgba(239,133,87,0.1)' : 'rgba(34,97,146,0.08)',
                  }}
                >
                  <feature.icon
                    size={18}
                    style={{
                      color: i % 2 === 0 ? 'var(--color-coral)' : 'var(--color-editorial-blue)',
                    }}
                  />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--color-ink)' }}>
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(32,43,53,0.6)' }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{ background: 'var(--color-ink)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 50%, rgba(34,97,146,0.3) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 50%, rgba(239,133,87,0.15) 0%, transparent 50%)
            `,
          }}
        />

        {/* Large serif BG text */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{
            fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(5rem, 20vw, 18rem)',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.03)',
            lineHeight: 1,
          }}
        >
          Learn
        </div>

        <div className="section-container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="editorial-label mb-6 block" style={{ color: 'rgba(239,133,87,0.7)' }}>
              Ready to begin?
            </span>
            <h2
              className="text-4xl md:text-6xl font-black text-white mb-6"
              style={{ letterSpacing: '-0.03em', lineHeight: 1.0 }}
            >
              Your next breakthrough
              <br />
              <span
                style={{
                  fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                  fontStyle: 'italic',
                  color: 'var(--color-coral)',
                }}
              >
                starts here.
              </span>
            </h2>
            <p
              className="text-lg mb-10 max-w-xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}
            >
              Upload your first document, choose Tamil or any other language, and experience what it means to truly understand what you study.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/dashboard"
                id="final-start-btn"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
                style={{
                  background: 'var(--color-coral)',
                  color: 'white',
                  boxShadow: '0 4px 32px rgba(239,133,87,0.4)',
                }}
              >
                Start Learning Free <ArrowRight size={18} />
              </Link>
              <Link
                href="/library"
                id="final-demo-btn"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                }}
              >
                Try the DBMS Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer
        className="py-12 md:py-16"
        style={{
          background: 'var(--color-ink)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--color-editorial-blue)' }}
                >
                  <BookOpen size={15} className="text-white" />
                </div>
                <span className="font-bold text-white">
                  LinguaLearn<span style={{ color: 'var(--color-coral)' }}> AI</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Understand More. Learn Without Limits.
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Powered by Google Gemini AI
              </p>
            </div>

            {/* Product */}
            <div>
              <div className="editorial-label mb-4" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                Product
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'My Library', href: '/library' },
                  { label: 'Practice Arena', href: '/practice' },
                  { label: 'My Progress', href: '/progress' },
                  { label: 'Settings', href: '/settings' },
                ].map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="editorial-label mb-4" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                Languages
              </div>
              <div className="space-y-2.5">
                {LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    className="text-xs"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    {lang.name} ({lang.native})
                  </div>
                ))}
              </div>
            </div>

            {/* Built for */}
            <div>
              <div className="editorial-label mb-4" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                Built For
              </div>
              <div className="space-y-2.5">
                {['Hackathon 2024', 'Google Gemini API', 'Next.js 16', 'Educational Equity'].map(
                  (item) => (
                    <div key={item} className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div
            className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              © 2024 LinguaLearn AI. Built for the Global Inclusivity Hackathon.
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--color-coral)' }}
              />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                ELX-P01 · Squad Mirror Dimensions
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
