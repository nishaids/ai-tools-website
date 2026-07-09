'use client';

import type { ColdEmailOutput } from '@/lib/schemas';
import { coldEmailToText, downloadTextFile } from '@/lib/exporters/text';
import { ActionButton, CopyIcon, DownloadIcon, ImproveButtonDark, useCopy } from './shared';

interface Props {
  data: ColdEmailOutput;
  onImprove?: (section: string) => void;
  improvingSection?: string | null;
}

export default function ColdEmailRenderer({ data, onImprove, improvingSection }: Props) {
  const copy = useCopy();

  const emailBody = [
    data.greeting,
    '',
    ...data.bodyParagraphs.flatMap((p) => [p, '']),
    data.cta,
    '',
    data.signOff,
  ]
    .join('\n')
    .trim();

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 justify-end">
        <ActionButton onClick={() => copy(coldEmailToText(data))} title="Copy everything">
          {CopyIcon} Copy all
        </ActionButton>
        <ActionButton onClick={() => downloadTextFile('cold-email.txt', coldEmailToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>

      {/* Subject variants */}
      <div className="glass rounded-xl p-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-300">Subject line options</p>
        {data.subjectVariants.map((subject, i) => (
          <div key={i} className="flex items-center justify-between gap-3 bg-white/5 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-200 min-w-0 truncate">{subject}</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[11px] tabular-nums ${subject.length > 45 ? 'text-amber-400' : 'text-gray-500'}`}>
                {subject.length} ch
              </span>
              <button
                type="button"
                onClick={() => copy(subject, 'Subject copied!')}
                className="no-print text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition text-gray-300"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Email body */}
      <div className="print-area bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
          <p className="text-[14px] mb-4">{data.greeting}</p>
          <div className="space-y-4 mb-4">
            {data.bodyParagraphs.map((p, i) => (
              <p key={i} className="text-[14px] leading-relaxed">{p}</p>
            ))}
          </div>
          {data.cta && <p className="text-[14px] font-medium mb-4">{data.cta}</p>}
          <p className="text-[14px]">{data.signOff}</p>
          <div className="no-print mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => copy(emailBody, 'Email body copied!')}
              className="text-xs px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 flex items-center gap-1.5"
            >
              {CopyIcon} Copy body
            </button>
            <ImproveButtonDark section="bodyParagraphs" onImprove={onImprove} improvingSection={improvingSection} />
          </div>
        </div>
      </div>

      {/* Follow-up */}
      {(data.followUp.subject || data.followUp.body) && (
        <div className="glass rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Follow-up (send after {data.followUp.delayDays} days)
            </p>
            <button
              type="button"
              onClick={() => copy(`Subject: ${data.followUp.subject}\n\n${data.followUp.body}`, 'Follow-up copied!')}
              className="no-print text-xs px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition text-gray-300"
            >
              Copy
            </button>
          </div>
          {data.followUp.subject && <p className="text-sm text-gray-300 font-medium">Subject: {data.followUp.subject}</p>}
          {data.followUp.body && <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{data.followUp.body}</p>}
        </div>
      )}
    </div>
  );
}
