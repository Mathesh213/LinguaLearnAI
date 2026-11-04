'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Eye, Type } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ReadingPrefs {
  readingMode: boolean;
  highContrast: boolean;
  dyslexicFont: boolean;
}

const LS_KEY = 'lingua-reading-prefs';

const defaults: ReadingPrefs = {
  readingMode: false,
  highContrast: false,
  dyslexicFont: false,
};

function applyPrefs(prefs: ReadingPrefs) {
  const root = document.documentElement;
  root.dataset.readingMode = prefs.readingMode ? '1' : '0';
  root.dataset.highContrast = prefs.highContrast ? '1' : '0';
  root.dataset.dyslexicFont = prefs.dyslexicFont ? '1' : '0';

  // High contrast mode
  if (prefs.highContrast) {
    root.classList.add('high-contrast');
  } else {
    root.classList.remove('high-contrast');
  }

  // Reading mode body class
  if (prefs.readingMode) {
    root.classList.add('reading-mode');
  } else {
    root.classList.remove('reading-mode');
  }

  // Dyslexic font (inject via CSS var)
  root.style.setProperty(
    '--font-reading',
    prefs.dyslexicFont ? '"OpenDyslexic", sans-serif' : 'var(--font-sans)',
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-black/5 last:border-0">
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
            checked ? 'bg-editorial-blue/10 text-editorial-blue' : 'bg-black/5 text-ink/40',
          )}
        >
          <Icon size={15} />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{label}</p>
          <p className="text-xs text-ink/50 mt-0.5">{description}</p>
        </div>
      </div>

      {/* Toggle switch */}
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-editorial-blue',
          checked ? 'bg-editorial-blue' : 'bg-black/15',
        )}
      >
        <span
          className={cn(
            'absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            checked && 'translate-x-5',
          )}
        />
      </button>
    </div>
  );
}

export default function ReadingModeToggle() {
  const [prefs, setPrefs] = useState<ReadingPrefs>(defaults);

  // Load persisted prefs
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        const parsed: ReadingPrefs = JSON.parse(stored);
        setPrefs(parsed);
        applyPrefs(parsed);
      }
    } catch {
      /* noop */
    }
  }, []);

  function update(key: keyof ReadingPrefs, value: boolean) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: value };
      applyPrefs(next);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink/40 mb-2">
        Reading Options
      </p>
      <div className="bg-ivory rounded-xl border border-black/8 px-4 divide-y divide-black/5">
        <ToggleRow
          icon={Moon}
          label="Reading Mode"
          description="White background, larger line height"
          checked={prefs.readingMode}
          onChange={(v) => update('readingMode', v)}
        />
        <ToggleRow
          icon={Eye}
          label="High Contrast"
          description="Stronger text-background contrast"
          checked={prefs.highContrast}
          onChange={(v) => update('highContrast', v)}
        />
        <ToggleRow
          icon={Type}
          label="Dyslexia-friendly Font"
          description="Uses OpenDyslexic typeface"
          checked={prefs.dyslexicFont}
          onChange={(v) => update('dyslexicFont', v)}
        />
      </div>
    </div>
  );
}
