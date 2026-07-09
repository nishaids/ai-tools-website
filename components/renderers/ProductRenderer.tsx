'use client';

import type { ProductDescriptionOutput } from '@/lib/schemas';
import { downloadTextFile, productToText } from '@/lib/exporters/text';
import { ActionButton, ChipList, CopyIcon, DownloadIcon, useCopy } from './shared';

export default function ProductRenderer({ data }: { data: ProductDescriptionOutput }) {
  const copy = useCopy();

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 justify-end">
        <ActionButton onClick={() => copy(productToText(data))} primary>
          {CopyIcon} Copy all
        </ActionButton>
        <ActionButton onClick={() => downloadTextFile('product-description.txt', productToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>

      {/* E-commerce style preview card */}
      <div className="print-area bg-white rounded-2xl overflow-hidden shadow-2xl text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl md:text-2xl font-extrabold leading-snug">{data.headline}</h2>
            <button
              type="button"
              onClick={() => copy(data.headline, 'Headline copied!')}
              className="no-print shrink-0 text-xs px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700"
            >
              Copy
            </button>
          </div>

          <p className="text-[14px] leading-relaxed text-gray-700">{data.description}</p>

          {data.bullets.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-gray-400">Highlights</p>
                <button
                  type="button"
                  onClick={() => copy(data.bullets.map((b) => `• ${b}`).join('\n'), 'Bullets copied!')}
                  className="no-print text-xs px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700"
                >
                  Copy bullets
                </button>
              </div>
              <ul className="space-y-1.5">
                {data.bullets.map((b, i) => (
                  <li key={i} className="text-[13.5px] leading-relaxed text-gray-700 pl-5 relative">
                    <span className="absolute left-0 top-[7px] w-2 h-2 rounded-full bg-emerald-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {data.seoKeywords.length > 0 && (
        <div className="glass rounded-xl p-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">SEO keywords</span>
          <ChipList items={data.seoKeywords} />
        </div>
      )}
    </div>
  );
}
