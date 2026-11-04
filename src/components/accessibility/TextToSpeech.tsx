'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import useSpeech from '@/hooks/useSpeech';

const SPEEDS = [0.5, 1, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

const LANGUAGE_CODES: Record<string, string> = {
  english: 'en-US',
  tamil: 'ta-IN',
  hindi: 'hi-IN',
  telugu: 'te-IN',
  malayalam: 'ml-IN',
};

interface TextToSpeechProps {
  text: string;
  language: string;
}

export default function TextToSpeech({ text, language }: TextToSpeechProps) {
  const langCode = LANGUAGE_CODES[language.toLowerCase()] ?? 'en-US';
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported, voices } =
    useSpeech();

  const [speed, setSpeed] = useState<Speed>(1);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const voiceMenuRef = useRef<HTMLDivElement>(null);

  // Filter voices for the current language
  const filteredVoices = voices.filter(
    (v: SpeechSynthesisVoice) => v.lang.startsWith(langCode.split('-')[0]) || v.lang === langCode,
  );

  // Auto-select first available voice when voices load or language changes
  useEffect(() => {
    if (filteredVoices.length > 0) {
      setSelectedVoice(filteredVoices[0].name);
    } else if (voices.length > 0) {
      setSelectedVoice(voices[0].name);
    }
  }, [voices, language]);

  // Close voice menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (voiceMenuRef.current && !voiceMenuRef.current.contains(e.target as Node)) {
        setShowVoiceMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-soft-neutral border border-black/8 text-ink/40 text-sm">
        <span>🔇</span>
        <span>Text-to-speech is not supported in this browser.</span>
      </div>
    );
  }

  const handlePlay = () => {
    if (isPaused) {
      resume();
    } else if (isSpeaking) {
      pause();
    } else {
      const voice = voices.find((v: SpeechSynthesisVoice) => v.name === selectedVoice) ?? null;
      speak(text, langCode, { rate: speed, voice });
    }
  };

  const handleStop = () => stop();

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-soft-neutral border border-black/8">
      {/* Play / Pause */}
      <button
        onClick={handlePlay}
        aria-label={isSpeaking && !isPaused ? 'Pause' : 'Play'}
        className="w-9 h-9 rounded-full bg-editorial-blue flex items-center justify-center text-white hover:bg-editorial-blue/90 transition-colors shadow-sm"
      >
        {isSpeaking && !isPaused ? (
          <Pause size={16} fill="white" />
        ) : (
          <Play size={16} fill="white" className="ml-0.5" />
        )}
      </button>

      {/* Stop */}
      <button
        onClick={handleStop}
        aria-label="Stop"
        disabled={!isSpeaking && !isPaused}
        className="w-9 h-9 rounded-full bg-black/8 flex items-center justify-center text-ink hover:bg-black/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Square size={14} fill="currentColor" />
      </button>

      {/* Speed selector */}
      <div className="flex items-center gap-1 bg-ivory rounded-lg border border-black/8 p-1">
        {SPEEDS.map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={cn(
              'px-2 py-1 rounded-md text-xs font-semibold transition-colors',
              speed === s
                ? 'bg-editorial-blue text-white'
                : 'text-ink/50 hover:text-ink',
            )}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Voice selector */}
      {(filteredVoices.length > 0 || voices.length > 0) && (
        <div ref={voiceMenuRef} className="relative">
          <button
            onClick={() => setShowVoiceMenu((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-ivory border border-black/8 text-xs text-ink/60 hover:text-ink transition-colors max-w-[160px]"
          >
            <span className="truncate">
              {selectedVoice
                ? voices.find((v: SpeechSynthesisVoice) => v.name === selectedVoice)?.name ?? 'Voice'
                : 'Select Voice'}
            </span>
            <ChevronDown size={12} className="shrink-0" />
          </button>

          {showVoiceMenu && (
            <div className="absolute bottom-full mb-1 left-0 w-56 bg-ivory border border-black/8 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="max-h-48 overflow-y-auto py-1">
                {(filteredVoices.length > 0 ? filteredVoices : voices).map((v: SpeechSynthesisVoice) => (
                  <button
                    key={v.name}
                    onClick={() => { setSelectedVoice(v.name); setShowVoiceMenu(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs hover:bg-black/5 transition-colors',
                      selectedVoice === v.name
                        ? 'text-editorial-blue font-semibold'
                        : 'text-ink/70',
                    )}
                  >
                    {v.name}
                    <span className="ml-1 text-ink/30">({v.lang})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Status indicator */}
      {isSpeaking && (
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-blue opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-editorial-blue" />
          </span>
          <span className="text-xs text-editorial-blue font-medium">
            {isPaused ? 'Paused' : 'Reading…'}
          </span>
        </div>
      )}
    </div>
  );
}
