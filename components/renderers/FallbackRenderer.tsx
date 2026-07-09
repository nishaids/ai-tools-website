'use client';

import ReactMarkdown from 'react-markdown';
import { downloadTextFile } from '@/lib/exporters/text';
import { ActionButton, CopyIcon, DownloadIcon, useCopy } from './shared';

/**
 * Last-resort renderer for the rare case where the model never produced
 * valid JSON (even after the server retry). Shows the raw text as formatted
 * markdown so the user always gets something usable — never a blank screen.
 */
export default function FallbackRenderer({ text }: { text: string }) {
  const copy = useCopy();

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
        <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-amber-200">
          The AI returned an unstructured response this time, so we&apos;re showing it as text. Hit Regenerate for the
          full formatted version.
        </p>
      </div>

      <div className="no-print flex gap-2 justify-end">
        <ActionButton onClick={() => copy(text)}>{CopyIcon} Copy</ActionButton>
        <ActionButton onClick={() => downloadTextFile('output.txt', text)}>{DownloadIcon} TXT</ActionButton>
      </div>

      <div className="glass rounded-xl p-5 max-h-[560px] overflow-auto">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-3 mt-4 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-bold text-white mb-2 mt-4">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-semibold text-violet-300 mb-2 mt-3">{children}</h3>,
            p: ({ children }) => <p className="text-sm text-gray-300 mb-3 leading-relaxed">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-sm text-gray-300">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 text-sm text-gray-300">{children}</ol>,
            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
            code: ({ children }) => <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs text-violet-300">{children}</code>,
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
