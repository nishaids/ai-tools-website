'use client';

import type { BlogTitleOutput } from '@/lib/schemas';
import { blogTitlesToText, downloadTextFile } from '@/lib/exporters/text';
import { ActionButton, CopyIcon, DownloadIcon, useCopy } from './shared';

export default function BlogTitleRenderer({ data }: { data: BlogTitleOutput }) {
  const copy = useCopy();

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 justify-end">
        <ActionButton onClick={() => copy(data.titles.map((t) => t.title).join('\n'), 'All titles copied!')}>
          {CopyIcon} Copy all
        </ActionButton>
        <ActionButton onClick={() => downloadTextFile('blog-titles.txt', blogTitlesToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>

      <div className="space-y-2.5">
        {data.titles.map((t, i) => (
          <div key={i} className="glass rounded-xl p-4 group">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-white leading-snug">{t.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  {t.style && (
                    <span className="px-2 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-[11px] font-medium">
                      {t.style}
                    </span>
                  )}
                  <span className={`text-[11px] tabular-nums ${t.title.length > 65 ? 'text-amber-400' : 'text-gray-500'}`}>
                    {t.title.length} chars
                  </span>
                </div>
                {t.rationale && <p className="text-xs text-gray-400 mt-1.5">{t.rationale}</p>}
              </div>
              <button
                type="button"
                onClick={() => copy(t.title)}
                className="no-print shrink-0 text-xs px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-gray-200 flex items-center gap-1.5"
              >
                {CopyIcon} Copy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
