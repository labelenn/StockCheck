import { useEffect, useState } from 'react';
import { THEME_STORAGE_KEY } from '../config';

export type ThemeModePreference = 'light' | 'dark' | 'system';

function isThemeModePreference(value: string | null): value is ThemeModePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private mode, quota, etc.) — app still works in-memory.
  }
}

/**
 * Tracks the user's light/dark/system theme preference, persisted as a
 * plain string in localStorage (no TTL — this should stick around).
 */
export function useThemeModePreference(): [
  ThemeModePreference,
  (mode: ThemeModePreference) => void,
] {
  const [preference, setPreferenceState] = useState<ThemeModePreference>(() => {
    const raw = safeGet(THEME_STORAGE_KEY);
    return isThemeModePreference(raw) ? raw : 'light';
  });

  useEffect(() => {
    safeSet(THEME_STORAGE_KEY, preference);
  }, [preference]);

  return [preference, setPreferenceState];
}
