'use client';

import { useState } from 'react';
import type { YouTubeScriptOutput } from '@/lib/schemas';
import { downloadTextFile, scriptToText } from '@/lib/exporters/text';
import { ActionButton, ChipList, CopyIcon, DownloadIcon, ImproveButtonDark, useCopy } from './shared';

interface Props {
  data: YouTubeScriptOutput;
  onImprove?: (section: string) => void;
  improvingSection?: string | null;
}

export default function ScriptRenderer({ data, onImprove, improvingSection }: Props) {
  const copy = useCopy();

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 justify-end">
        <ActionButton onClick={() => copy(scriptToText(data), 'Full script copied!')} primary>
          {CopyIcon} Copy all
        </ActionButton>
        <ActionButton onClick={() => downloadTextFile('youtube-script.txt', scriptToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>

      {/* Title options */}
      {data.titleOptions.length > 0 && (
        <div className="glass rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-red-300">Title options</p>
          {data.titleOptions.map((t, i) => (
            <div key={i} className="flex items-center justify-between gap-3 bg-white/5 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-200 min-w-0">{t}</span>
              <button
                type="button"
                onClick={() => copy(t, 'Title copied!')}
                className="no-print shrink-0 text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition text-gray-300"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Hook */}
      <TimelineCard
        timestamp="0:00"
        heading="Hook"
        content={data.hook}
        accent="red"
        defaultOpen
        onCopy={() => copy(data.hook, 'Hook copied!')}
        action={<ImproveButtonDark section="hook" onImprove={onImprove} improvingSection={improvingSection} />}
      />

      {/* Sections timeline */}
      <div className="space-y-2.5">
        {data.sections.map((s, i) => (
          <TimelineCard
            key={i}
            timestamp={s.timestamp}
            heading={s.heading}
            content={s.content}
            accent="violet"
            defaultOpen={i === 0}
            onCopy={() => copy(s.content, 'Section copied!')}
          />
        ))}
      </div>

      {/* CTA */}
      {data.cta && (
        <TimelineCard
          timestamp="End"
          heading="Call to action"
          content={data.cta}
          accent="emerald"
          onCopy={() => copy(data.cta, 'CTA copied!')}
        />
      )}

      {/* Description + tags */}
      {data.description && (
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Video description</p>
            <button
              type="button"
              onClick={() => copy(data.description, 'Description copied!')}
              className="no-print text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition text-gray-300"
            >
              Copy
            </button>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{data.description}</p>
        </div>
      )}
      {data.tags.length > 0 && (
        <div className="glass rounded-xl p-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Tags</p>
          <ChipList items={data.tags} />
        </div>
      )}
    </div>
  );
}

const ACCENTS: Record<string, { badge: string; border: string }> = {
  red: { badge: 'bg-red-500/20 text-red-300 border-red-500/30', border: 'border-red-500/20' },
  violet: { badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30', border: 'border-violet-500/20' },
  emerald: { badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', border: 'border-emerald-500/20' },
};

function TimelineCard({
  timestamp,
  heading,
  content,
  accent,
  defaultOpen = false,
  onCopy,
  action,
}: {
  timestamp: string;
  heading: string;
  content: string;
  accent: keyof typeof ACCENTS;
  defaultOpen?: boolean;
  onCopy: () => void;
  action?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const styles = ACCENTS[accent];

  return (
    <div className={`glass rounded-xl border ${styles.border} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition"
      >
        <span className={`shrink-0 px-2 py-0.5 rounded-md border text-[11px] font-bold tabular-nums ${styles.badge}`}>
          {timestamp}
        </span>
        <span className="flex-1 text-sm font-semibold text-white min-w-0 truncate">{heading}</span>
        <svg
          className={`w-4 h-4 text-gray-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-white/5">
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap mt-3">{content}</p>
          <div className="no-print mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onCopy}
              className="text-xs px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-gray-300"
            >
              Copy section
            </button>
            {action}
          </div>
        </div>
      )}
    </div>
  );
}
