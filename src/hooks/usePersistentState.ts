import { useEffect, useState } from 'react';

interface Envelope<T> {
  value: T;
  lastUpdated: number;
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

export interface UsePersistentStateOptions<T> {
  /** Days before a saved value is considered stale. Omit for no expiry. */
  ttlDays?: number;
  /**
   * Called when a saved value has expired. Receives the expired value and
   * the caller's initialValue; returns the value to actually use. Defaults
   * to discarding everything and returning initialValue. Use this to carry
   * forward specific fields (e.g. a user preference) across expiry.
   */
  onExpire?: (expiredValue: T, initialValue: T) => T;
}

/**
 * Like useState, but persisted to localStorage under `key` alongside a
 * `lastUpdated` timestamp. If `ttlDays` is set and the saved value is older
 * than that, it is treated as expired: `onExpire` (or a full reset to
 * initialValue by default) decides what the starting value becomes.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  options: UsePersistentStateOptions<T> = {},
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { ttlDays, onExpire } = options;

  const [state, setState] = useState<T>(() => {
    const raw = safeGet(key);
    if (!raw) return initialValue;
    try {
      const parsed: Envelope<T> = JSON.parse(raw);
      if (ttlDays !== undefined) {
        const ageMs = Date.now() - parsed.lastUpdated;
        const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
        if (ageMs > ttlMs) {
          return onExpire ? onExpire(parsed.value, initialValue) : initialValue;
        }
      }
      return parsed.value;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    const envelope: Envelope<T> = { value: state, lastUpdated: Date.now() };
    safeSet(key, JSON.stringify(envelope));
  }, [key, state]);

  return [state, setState];
}
