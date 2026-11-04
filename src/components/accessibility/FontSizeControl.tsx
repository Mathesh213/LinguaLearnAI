'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils/cn';

type FontSize = 'sm' | 'md' | 'lg' | 'xl';

const FONT_OPTIONS: { size: FontSize; label: string; preview: string; cssClass: string }[] = [
  { size: 'sm', label: 'Small', preview: 'Aa', cssClass: 'text-xs' },
  { size: 'md', label: 'Medium', preview: 'Aa', cssClass: 'text-sm' },
  { size: 'lg', label: 'Large', preview: 'Aa', cssClass: 'text-base' },
  { size: 'xl', label: 'XL', preview: 'Aa', cssClass: 'text-xl' },
];

const LS_KEY = 'lingua-font-size';

const CSS_VARS: Record<FontSize, string> = {
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '21px',
};

export default function FontSizeControl() {
  const [selected, setSelected] = useState<FontSize>('md');

  // Load persisted value
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY) as FontSize | null;
      if (stored && CSS_VARS[stored]) {
        setSelected(stored);
        applyFontSize(stored);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  function applyFontSize(size: FontSize) {
    document.documentElement.style.setProperty('--reading-font-size', CSS_VARS[size]);
    document.documentElement.dataset.fontSize = size;
  }

  function handleSelect(size: FontSize) {
    setSelected(size);
    applyFontSize(size);
    try {
      localStorage.setItem(LS_KEY, size);
    } catch {
      /* noop */
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-ink/40">
        Text Size
      </p>
      <div className="flex items-center gap-2">
        {FONT_OPTIONS.map((opt) => (
          <button
            key={opt.size}
            onClick={() => handleSelect(opt.size)}
            aria-pressed={selected === opt.size}
            className={cn(
              'flex flex-col items-center gap-1 w-14 py-2.5 rounded-xl border transition-all duration-150',
              selected === opt.size
                ? 'border-editorial-blue bg-editorial-blue/8 text-editorial-blue'
                : 'border-black/8 bg-ivory text-ink/50 hover:border-editorial-blue/40 hover:text-ink',
            )}
          >
            <span
              className={cn('font-semibold leading-none select-none', opt.cssClass)}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {opt.preview}
            </span>
            <span className="text-[10px] font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
