'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ToolId } from '@/lib/schemas';
import { toPlainText } from '@/lib/exporters/text';

/**
 * Last 5 generations per tool, stored as structured JSON in localStorage,
 * restorable back into the full renderer with one click.
 */

export interface HistoryEntry {
  tool: string;
  data?: unknown;
  fallbackText?: string;
  preview: string;
  timestamp: number;
}

const MAX_ENTRIES_PER_TOOL = 5;
// v2: structured entries (v1 stored raw strings under 'tool_history').
const STORAGE_KEY = 'tool_history_v2';

export function saveToHistory(toolId: ToolId, payload: { data?: unknown; fallbackText?: string }): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: HistoryEntry[] = raw ? JSON.parse(raw) : [];

    const preview = (payload.data !== undefined
      ? toPlainText(toolId, payload.data)
      : payload.fallbackText || ''
    )
      .replace(/\s+/g, ' ')
      .slice(0, 100);

    history.unshift({
      tool: toolId,
      data: payload.data,
      fallbackText: payload.fallbackText,
      preview,
      timestamp: Date.now(),
    });

    // Keep only the latest N entries per tool.
    const counts = new Map<string, number>();
    const trimmed = history.filter((entry) => {
      const count = counts.get(entry.tool) || 0;
      if (count >= MAX_ENTRIES_PER_TOOL) return false;
      counts.set(entry.tool, count + 1);
      return true;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage unavailable or full — history is a nice-to-have
  }
}

interface OutputHistoryProps {
  toolId: ToolId;
  /** Restores an entry into the live output view. */
  onRestore: (entry: HistoryEntry) => void;
  /** Bump to re-read storage after a new generation. */
  refreshToken?: number;
}

export default function OutputHistory({ toolId, onRestore, refreshToken }: OutputHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const history: HistoryEntry[] = raw ? JSON.parse(raw) : [];
      setEntries(history.filter((e) => e.tool === toolId));
    } catch {
      setEntries([]);
    }
  }, [toolId]);

  useEffect(() => {
    load();
  }, [load, refreshToken]);

  if (entries.length === 0) return null;

  const formatTime = (ts: number) => {
    const diffMin = Math.floor((Date.now() - ts) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="no-print mt-8">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors w-full group"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium">Recent Outputs</span>
        <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">{entries.length}</span>
        <div className="flex-1 h-px bg-white/10 group-hover:bg-white/20 transition-colors" />
      </button>

      {isOpen && (
        <div className="mt-4 space-y-2.5 animate-fade-in">
          {entries.map((entry, i) => (
            <div key={entry.timestamp} className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center text-xs text-violet-400 font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-300 truncate">{entry.preview || 'Generated output'}</p>
                  <p className="text-xs text-gray-500">{formatTime(entry.timestamp)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRestore(entry)}
                className="shrink-0 text-xs px-3 py-1.5 bg-violet-500/15 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 rounded-lg transition font-medium"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
