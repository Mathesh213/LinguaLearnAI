import type { UserPreferences, Language, LearningLevel } from '@/types';

const PREFS_KEY = 'lingua-learn-prefs';

export const DEFAULT_PREFERENCES: UserPreferences = {
  preferredLanguage: 'english',
  learningLevel: 'intermediate',
  fontSize: 'medium',
  highContrast: false,
  dyslexiaFont: false,
  readingMode: false,
  theme: 'light',
  speechRate: 1.0,
  speechPitch: 1.0,
};

export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(PREFS_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getPreferences();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...prefs }));
  } catch {
    // localStorage not available
  }
}

export function resetPreferences(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREFS_KEY);
}

export function getPreference<K extends keyof UserPreferences>(
  key: K
): UserPreferences[K] {
  return getPreferences()[key];
}

export function setPreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  savePreferences({ [key]: value });
}
