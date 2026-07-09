'use client';

import type { CoverLetterOutput } from '@/lib/schemas';
import { coverLetterToText, downloadTextFile } from '@/lib/exporters/text';
import { exportCoverLetterDocx } from '@/lib/exporters/docx';
import { toast } from '@/components/Toast';
import {
  ActionButton,
  CopyIcon,
  DownloadIcon,
  ImproveButton,
  PrintIcon,
  ScaledPaper,
  useCopy,
} from './shared';

interface Props {
  data: CoverLetterOutput;
  onImprove?: (section: string) => void;
  improvingSection?: string | null;
}

export default function CoverLetterRenderer({ data, onImprove, improvingSection }: Props) {
  const copy = useCopy();
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleDocx = async () => {
    try {
      await exportCoverLetterDocx(data);
      toast('DOCX downloaded');
    } catch (err) {
      console.error(err);
      toast('DOCX export failed', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 justify-end">
        <ActionButton onClick={() => copy(coverLetterToText(data))} title="Copy as plain text">
          {CopyIcon} Copy
        </ActionButton>
        <ActionButton onClick={() => window.print()} title="Print → Save as PDF" primary>
          {PrintIcon} Print / PDF
        </ActionButton>
        <ActionButton onClick={handleDocx} title="Download Word document">
          {DownloadIcon} DOCX
        </ActionButton>
        <ActionButton onClick={() => downloadTextFile('cover-letter.txt', coverLetterToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>

      {/* Business-letter layout on white paper */}
      <ScaledPaper>
        <div
          className="print-area bg-white text-gray-900 min-h-[1123px] px-16 py-14 shadow-2xl"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          <div className="mb-8">
            <p className="text-[15px] font-bold">{data.sender.name}</p>
            <p className="text-[12px] text-gray-600">
              {[data.sender.email, data.sender.phone].filter(Boolean).join(' | ')}
            </p>
          </div>

          <p className="text-[12.5px] mb-8">{today}</p>

          <div className="mb-8 text-[12.5px] leading-relaxed">
            {data.recipient.name && <p>{data.recipient.name}</p>}
            {data.recipient.title && <p>{data.recipient.title}</p>}
            {data.recipient.company && <p>{data.recipient.company}</p>}
          </div>

          <p className="text-[13px] mb-5">{data.salutation}</p>

          <div className="space-y-4 mb-8">
            <div className="no-print flex justify-end">
              <ImproveButton section="bodyParagraphs" onImprove={onImprove} improvingSection={improvingSection} />
            </div>
            {data.bodyParagraphs.map((p, i) => (
              <p key={i} className="text-[13px] leading-[1.75] text-justify">
                {p}
              </p>
            ))}
          </div>

          <p className="text-[13px]">{data.closing}</p>
          <p className="text-[13px] font-bold mt-8">{data.signature}</p>
        </div>
      </ScaledPaper>
    </div>
  );
}
