'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Globe, Zap, Eye, Type, Sun, Moon, Volume2,
  CheckCircle, Trash2, Info, Settings, ExternalLink,
} from 'lucide-react';
import { DEFAULT_PREFERENCES, savePreferences } from '@/lib/storage/preferences';
import type { UserPreferences, Language, LearningLevel } from '@/types';

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

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const stored = localStorage.getItem('lingua-learn-prefs');
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch { return DEFAULT_PREFERENCES; }
  });
  const [saved, setSaved] = useState(false);
  const [clearedData, setClearedData] = useState(false);

  const update = <K extends keyof UserPreferences>(key: K, val: UserPreferences[K]) => {
    setPrefs(p => ({ ...p, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    savePreferences(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = async () => {
    if (!confirm('Clear all locally stored data? This cannot be undone.')) return;
    try {
      const { clearAllData } = await import('@/lib/storage/indexeddb');
      await clearAllData();
      localStorage.clear();
      setClearedData(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-ivory)' }}>
      <SettingsTopBar />
      <main id="main-content" className="max-w-2xl mx-auto px-4 md:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-xs font-bold tracking-widest uppercase mb-3 block" style={{ color: 'var(--color-coral)' }}>Settings</span>
          <h1 className="font-black mb-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', color: 'var(--color-ink)' }}>
            Personalise your{' '}
            <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontStyle: 'italic', color: 'var(--color-editorial-blue)' }}>learning.</span>
          </h1>
          <p style={{ color: 'rgba(32,43,53,0.55)' }}>Preferences are saved locally in your browser.</p>
        </motion.div>

        <div className="space-y-6">
          {/* Language */}
          <SettingsSection title="Preferred Language" icon={Globe} description="Content will be shown in this language by default.">
            <div className="grid grid-cols-1 gap-2">
              {LANGUAGES.map(lang => (
                <button key={lang.value} onClick={() => update('preferredLanguage', lang.value)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
                  style={{ background: prefs.preferredLanguage === lang.value ? 'rgba(34,97,146,0.08)' : 'var(--color-ivory)', border: `1.5px solid ${prefs.preferredLanguage === lang.value ? 'rgba(34,97,146,0.3)' : 'rgba(32,43,53,0.08)'}`, color: 'var(--color-ink)' }}>
                  <span className="font-medium flex-1 text-left">{lang.label}</span>
                  <span style={{ color: 'rgba(32,43,53,0.5)', fontFamily: 'sans-serif' }}>{lang.native}</span>
                  {prefs.preferredLanguage === lang.value && <CheckCircle size={15} style={{ color: 'var(--color-editorial-blue)' }} />}
                </button>
              ))}
            </div>
          </SettingsSection>

          {/* Learning Level */}
          <SettingsSection title="Learning Level" icon={Zap} description="Controls how content is simplified and quiz difficulty.">
            <div className="space-y-2">
              {LEVELS.map(lv => (
                <button key={lv.value} onClick={() => update('learningLevel', lv.value)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all"
                  style={{ background: prefs.learningLevel === lv.value ? 'rgba(239,133,87,0.08)' : 'var(--color-ivory)', border: `1.5px solid ${prefs.learningLevel === lv.value ? 'rgba(239,133,87,0.3)' : 'rgba(32,43,53,0.08)'}` }}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-ink)' }}>{lv.label}</span>
                    {prefs.learningLevel === lv.value && <CheckCircle size={15} style={{ color: 'var(--color-coral)' }} />}
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(32,43,53,0.5)' }}>{lv.desc}</p>
                </button>
              ))}
            </div>
          </SettingsSection>

          {/* Accessibility */}
          <SettingsSection title="Accessibility" icon={Eye} description="Visual and reading preferences.">
            <div className="space-y-3">
              {/* Font size */}
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.08)' }}>
                <div className="flex items-center gap-2">
                  <Type size={15} style={{ color: 'rgba(32,43,53,0.5)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Font Size</p>
                    <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>Reading content font size</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {(['small', 'medium', 'large', 'xl'] as const).map(fs => (
                    <button key={fs} onClick={() => update('fontSize', fs)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
                      style={{ background: prefs.fontSize === fs ? 'var(--color-editorial-blue)' : 'var(--color-soft-neutral)', color: prefs.fontSize === fs ? 'white' : 'rgba(32,43,53,0.6)' }}>
                      {fs === 'small' ? 'S' : fs === 'medium' ? 'M' : fs === 'large' ? 'L' : 'XL'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              {[
                { key: 'highContrast' as const, label: 'High Contrast Mode', desc: 'Increases text/background contrast' },
                { key: 'dyslexiaFont' as const, label: 'Dyslexia-Friendly Font', desc: 'Uses OpenDyslexic font for readability' },
                { key: 'readingMode' as const, label: 'Reading Mode', desc: 'Removes distractions while reading content' },
              ].map(toggle => (
                <div key={toggle.key} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.08)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{toggle.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(32,43,53,0.45)' }}>{toggle.desc}</p>
                  </div>
                  <button onClick={() => update(toggle.key, !prefs[toggle.key])}
                    className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                    style={{ background: prefs[toggle.key] ? 'var(--color-editorial-blue)' : 'rgba(32,43,53,0.15)' }}>
                    <div className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: prefs[toggle.key] ? '1.375rem' : '0.125rem' }} />
                  </button>
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Text to Speech */}
          <SettingsSection title="Text-to-Speech" icon={Volume2} description="Controls for read-aloud feature.">
            <div className="space-y-4">
              <div className="p-3 rounded-xl" style={{ background: 'var(--color-ivory)', border: '1px solid rgba(32,43,53,0.08)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Speech Rate</p>
                  <span className="text-sm font-bold" style={{ color: 'var(--color-editorial-blue)' }}>{prefs.speechRate.toFixed(1)}×</span>
                </div>
                <input type="range" min="0.5" max="2.0" step="0.1" value={prefs.speechRate}
                  onChange={e => update('speechRate', parseFloat(e.target.value))}
                  className="w-full" style={{ accentColor: 'var(--color-editorial-blue)' }} />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'rgba(32,43,53,0.4)' }}>
                  <span>Slow (0.5×)</span><span>Fast (2.0×)</span>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* API Key info */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(34,97,146,0.05)', border: '1px solid rgba(34,97,146,0.15)' }}>
            <div className="flex items-start gap-3">
              <Info size={16} style={{ color: 'var(--color-editorial-blue)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-editorial-blue)' }}>Gemini API Key</p>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'rgba(32,43,53,0.65)' }}>
                  To enable AI features (translation, simplification, quiz generation), add your Gemini API key to <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(34,97,146,0.1)' }}>.env.local</code>:
                </p>
                <code className="block text-xs px-3 py-2 rounded-lg whitespace-pre-wrap" style={{ background: 'rgba(34,97,146,0.08)', color: 'var(--color-editorial-blue)' }}>
                  GEMINI_API_KEY=your_key_here{'\n'}GEMINI_MODEL=gemini-3.6-flash
                </code>
                <p className="text-xs leading-relaxed mt-2" style={{ color: 'rgba(32,43,53,0.65)' }}>
                  These variables are server-side only. Do not prefix them with NEXT_PUBLIC_.
                </p>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold mt-2 hover:underline"
                  style={{ color: 'var(--color-editorial-blue)' }}>
                  Get a free API key at Google AI Studio <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* Save button */}
          <button onClick={handleSave}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02]"
            style={{ background: saved ? '#16a34a' : 'var(--color-editorial-blue)', color: 'white', boxShadow: '0 4px 24px rgba(34,97,146,0.3)' }}>
            {saved ? '✓ Preferences Saved!' : 'Save Preferences'}
          </button>

          {/* Danger zone */}
          <div className="rounded-2xl p-5" style={{ border: '1px solid rgba(239,133,87,0.2)' }}>
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--color-coral)' }}>Danger Zone</h3>
            <p className="text-xs mb-4" style={{ color: 'rgba(32,43,53,0.5)' }}>This will delete all your documents, translations, and quiz history from local storage.</p>
            {clearedData ? (
              <div className="flex items-center gap-2 text-sm" style={{ color: '#16a34a' }}>
                <CheckCircle size={15} /> All data cleared successfully
              </div>
            ) : (
              <button onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: 'rgba(239,133,87,0.08)', color: 'var(--color-coral)', border: '1px solid rgba(239,133,87,0.2)' }}>
                <Trash2 size={14} /> Clear All Local Data
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingsSection({ title, icon: Icon, description, children }: { title: string; icon: React.ElementType; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--color-soft-neutral)', border: '1px solid rgba(32,43,53,0.06)' }}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,97,146,0.08)' }}>
          <Icon size={15} style={{ color: 'var(--color-editorial-blue)' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: 'var(--color-ink)' }}>{title}</h3>
          <p className="text-xs" style={{ color: 'rgba(32,43,53,0.5)' }}>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function SettingsTopBar() {
  return (
    <nav className="sticky top-0 z-40 border-b" style={{ background: 'rgba(234,230,222,0.95)', backdropFilter: 'blur(16px)', borderColor: 'rgba(32,43,53,0.08)' }}>
      <div className="max-w-2xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-editorial-blue)' }}>
            <BookOpen size={15} className="text-white" />
          </div>
          <span className="font-bold" style={{ color: 'var(--color-ink)' }}>LinguaLearn<span style={{ color: 'var(--color-coral)' }}> AI</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ color: 'rgba(32,43,53,0.65)' }}>Dashboard</Link>
          <Link href="/library" className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-coral)', color: 'white' }}>Upload Doc</Link>
        </div>
      </div>
    </nav>
  );
}
