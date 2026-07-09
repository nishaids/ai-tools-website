'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from '@/components/Toast';

/** Copy text to clipboard with a toast, falling back for older browsers. */
export function useCopy() {
  return useCallback(async (text: string, label = 'Copied!') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    toast(label);
  }, []);
}

export function ActionButton({
  onClick,
  children,
  title,
  primary,
  disabled,
}: {
  onClick: () => void;
  children: ReactNode;
  title?: string;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`no-print flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed ${
        primary
          ? 'bg-violet-600 hover:bg-violet-500 text-white border-violet-500/50'
          : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
      }`}
    >
      {children}
    </button>
  );
}

export const CopyIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
  </svg>
);

export const PrintIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

export const DownloadIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const ImproveIcon = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

/**
 * Small "↻ Improve" button attached to a major output section. Re-calls the
 * API for just that section (costs one credit) and swaps the result in.
 */
export function ImproveButton({
  section,
  onImprove,
  improvingSection,
}: {
  section: string;
  onImprove?: (section: string) => void;
  improvingSection?: string | null;
}) {
  if (!onImprove) return null;
  const busy = improvingSection === section;
  return (
    <button
      type="button"
      onClick={() => onImprove(section)}
      disabled={Boolean(improvingSection)}
      title="Regenerate this section (uses 1 credit)"
      className="no-print inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition disabled:opacity-50"
    >
      <span className={busy ? 'animate-spin' : ''}>{ImproveIcon}</span>
      {busy ? 'Improving…' : 'Improve'}
    </button>
  );
}

/** Same button, styled for dark cards. */
export function ImproveButtonDark(props: {
  section: string;
  onImprove?: (section: string) => void;
  improvingSection?: string | null;
}) {
  if (!props.onImprove) return null;
  const busy = props.improvingSection === props.section;
  return (
    <button
      type="button"
      onClick={() => props.onImprove?.(props.section)}
      disabled={Boolean(props.improvingSection)}
      title="Regenerate this section (uses 1 credit)"
      className="no-print inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide text-violet-300 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 transition disabled:opacity-50"
    >
      <span className={busy ? 'animate-spin' : ''}>{ImproveIcon}</span>
      {busy ? 'Improving…' : 'Improve'}
    </button>
  );
}

/** Variant card with one-tap copy and an optional character counter. */
export function VariantCard({
  label,
  text,
  charLimit,
  charWarning,
  children,
}: {
  label: string;
  text: string;
  /** Show "n / limit" and turn red past the limit. */
  charLimit?: number;
  /** Soft warning message when past charLimit. */
  charWarning?: string;
  children?: ReactNode;
}) {
  const copy = useCopy();
  const over = charLimit !== undefined && text.length > charLimit;
  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-300">{label}</span>
        <div className="flex items-center gap-3">
          {charLimit !== undefined && (
            <span className={`text-xs tabular-nums ${over ? 'text-red-400 font-semibold' : 'text-gray-500'}`}>
              {text.length.toLocaleString()} / {charLimit.toLocaleString()}
            </span>
          )}
          <button
            type="button"
            onClick={() => copy(text)}
            className="no-print text-xs px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition flex items-center gap-1.5 text-gray-200"
          >
            {CopyIcon}
            Copy
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{text}</p>
      {over && charWarning && <p className="text-xs text-amber-400">{charWarning}</p>}
      {children}
    </div>
  );
}

/** Hashtags (or keywords) as copyable chips + copy-all. */
export function ChipList({ items, prefix = '' }: { items: string[]; prefix?: string }) {
  const copy = useCopy();
  if (!items.length) return null;
  const rendered = items.map((item) => `${prefix}${item.replace(new RegExp(`^${prefix}`), '')}`);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {rendered.map((item, i) => (
        <button
          key={`${item}-${i}`}
          type="button"
          onClick={() => copy(item)}
          title="Copy"
          className="no-print px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs hover:bg-cyan-500/20 transition"
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        onClick={() => copy(rendered.join(' '), 'All copied!')}
        className="no-print px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 text-xs hover:bg-white/20 transition font-medium"
      >
        Copy all
      </button>
    </div>
  );
}

/**
 * Scales a fixed-width A4 "paper" (210mm ≈ 794px) down to fit its container
 * on small screens via CSS transform; resets to natural size for printing.
 */
export function ScaledPaper({ children }: { children: ReactNode }) {
  const A4_WIDTH = 794;
  const containerRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const paper = paperRef.current;
    if (!container || !paper) return;
    const update = () => {
      const width = container.clientWidth;
      const nextScale = width >= A4_WIDTH ? 1 : width / A4_WIDTH;
      setScale(nextScale);
      setScaledHeight(paper.offsetHeight * nextScale);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(paper);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden scaled-paper-container"
      style={{ height: scaledHeight }}
    >
      <div
        ref={paperRef}
        className="paper-scale"
        style={{ width: A4_WIDTH, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        {children}
      </div>
    </div>
  );
}
