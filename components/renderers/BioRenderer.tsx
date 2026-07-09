'use client';

import type { BioOutput } from '@/lib/schemas';
import { bioToText, downloadTextFile } from '@/lib/exporters/text';
import { ActionButton, DownloadIcon, VariantCard } from './shared';

// Character limits by variant length so users see platform fit at a glance.
const LIMITS: Record<string, number> = { short: 150, medium: 300, long: 500 };

export default function BioRenderer({ data }: { data: BioOutput }) {
  return (
    <div className="space-y-4">
      <div className="no-print flex justify-end">
        <ActionButton onClick={() => downloadTextFile('bio.txt', bioToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>
      <div className="space-y-3">
        {data.variants.map((v, i) => (
          <VariantCard
            key={i}
            label={v.length || `Variant ${i + 1}`}
            text={v.text}
            charLimit={LIMITS[v.length?.toLowerCase()] ?? undefined}
            charWarning="Over the target length for this variant."
          />
        ))}
      </div>
    </div>
  );
}
