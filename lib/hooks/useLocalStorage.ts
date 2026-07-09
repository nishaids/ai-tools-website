'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useState synced to localStorage. Reads lazily after mount (SSR-safe) and
 * writes on every change. Used for form draft autosave.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(initialValue);
  const loaded = useRef(false);

  // Hydrate from storage after mount to avoid SSR/client markup mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // corrupt entry or storage unavailable — keep the initial value
    }
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // storage full/unavailable — state still updates in memory
        }
        return resolved;
      });
    },
    [key]
  );

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setValue(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set, clear];
}
