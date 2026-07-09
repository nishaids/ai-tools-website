'use client';

import type { EmailOutput } from '@/lib/schemas';
import { downloadTextFile, emailToText } from '@/lib/exporters/text';
import { ActionButton, CopyIcon, DownloadIcon, ImproveButton, useCopy } from './shared';

interface Props {
  data: EmailOutput;
  onImprove?: (section: string) => void;
  improvingSection?: string | null;
}

export default function EmailRenderer({ data, onImprove, improvingSection }: Props) {
  const copy = useCopy();

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 justify-end">
        <ActionButton onClick={() => copy(emailToText(data))} title="Copy full email as plain text" primary>
          {CopyIcon} Copy email
        </ActionButton>
        <ActionButton onClick={() => downloadTextFile('email.txt', emailToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>

      {/* Email-client style card */}
      <div className="print-area bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">Subject</p>
              <p className="font-semibold text-gray-900 truncate">{data.subject}</p>
            </div>
            <button
              type="button"
              onClick={() => copy(data.subject, 'Subject copied!')}
              className="no-print shrink-0 text-xs px-2.5 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-gray-700"
            >
              Copy subject
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
          <p className="text-[14px] mb-4">{data.greeting}</p>
          <div className="space-y-4 mb-6">
            {data.bodyParagraphs.map((p, i) => (
              <p key={i} className="text-[14px] leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <p className="text-[14px]">{data.signOff}</p>
          <p className="text-[14px] font-semibold">{data.signature}</p>
          <div className="no-print mt-5 pt-4 border-t border-gray-100 flex justify-end">
            <ImproveButton section="bodyParagraphs" onImprove={onImprove} improvingSection={improvingSection} />
          </div>
        </div>
      </div>
    </div>
  );
}
