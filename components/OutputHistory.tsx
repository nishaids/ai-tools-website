'use client';

import { useState, useEffect, useCallback } from 'react';

interface HistoryEntry {
  tool: string;
  output: string;
  timestamp: number;
}

interface OutputHistoryProps {
  toolSlug: string;
  toolName: string;
}

const MAX_ENTRIES_PER_TOOL = 5;
const STORAGE_KEY = 'tool_history';

export function saveToHistory(toolSlug: string, output: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history: HistoryEntry[] = raw ? JSON.parse(raw) : [];

    // Add new entry at the beginning
    history.unshift({
      tool: toolSlug,
      output,
      timestamp: Date.now(),
    });

    // Keep only the latest MAX entries per tool
    const toolEntries = new Map<string, number>();
    const filtered = history.filter((entry) => {
      const count = toolEntries.get(entry.tool) || 0;
      if (count >= MAX_ENTRIES_PER_TOOL) return false;
      toolEntries.set(entry.tool, count + 1);
      return true;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    // localStorage unavailable
  }
}

export default function OutputHistory({ toolSlug, toolName }: OutputHistoryProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const history: HistoryEntry[] = JSON.parse(raw);
        const toolEntries = history.filter((e) => e.tool === toolSlug);
        setEntries(toolEntries);
      }
    } catch {
      // localStorage unavailable
    }
  }, [toolSlug]);

  const refreshHistory = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const history: HistoryEntry[] = JSON.parse(raw);
        const toolEntries = history.filter((e) => e.tool === toolSlug);
        setEntries(toolEntries);
      }
    } catch {
      // localStorage unavailable
    }
  }, [toolSlug]);

  // Refresh on visibility change (navigating back)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') refreshHistory();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [refreshHistory]);

  if (entries.length === 0) return null;

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-8">
      <button
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
        <div className="mt-4 space-y-3 animate-fade-in">
          {entries.map((entry, i) => (
            <div key={entry.timestamp} className="glass rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/20 flex items-center justify-center text-xs text-violet-400 font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-300 truncate">
                    {entry.output.slice(0, 80)}...
                  </span>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-3">
                  {formatTime(entry.timestamp)}
                </span>
              </button>
              {expandedIndex === i && (
                <div className="px-4 pb-4 border-t border-white/5">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-auto mt-3 font-sans">
                    {entry.output}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
