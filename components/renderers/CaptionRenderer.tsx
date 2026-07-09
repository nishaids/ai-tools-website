'use client';

import type { SocialCaptionOutput } from '@/lib/schemas';
import { captionToText, downloadTextFile } from '@/lib/exporters/text';
import { ActionButton, ChipList, DownloadIcon, VariantCard, useCopy } from './shared';

const INSTAGRAM_LIMIT = 2200;
const HOOK_VISIBLE_LIMIT = 125; // chars shown before "...more"

export default function CaptionRenderer({ data }: { data: SocialCaptionOutput }) {
  const copy = useCopy();
  const hookOver = data.hook.length > HOOK_VISIBLE_LIMIT;

  return (
    <div className="space-y-4">
      <div className="no-print flex justify-end">
        <ActionButton onClick={() => downloadTextFile('captions.txt', captionToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>

      {/* Hook with visible-line warning */}
      {data.hook && (
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-300">Hook (first visible line)</span>
            <div className="flex items-center gap-3">
              <span className={`text-xs tabular-nums ${hookOver ? 'text-red-400 font-semibold' : 'text-gray-500'}`}>
                {data.hook.length} / {HOOK_VISIBLE_LIMIT}
              </span>
              <button
                type="button"
                onClick={() => copy(data.hook, 'Hook copied!')}
                className="no-print text-xs px-2.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition text-gray-200"
              >
                Copy
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-100 font-medium">{data.hook}</p>
          {hookOver && (
            <p className="text-xs text-amber-400 mt-2">
              Instagram truncates the caption around {HOOK_VISIBLE_LIMIT} characters — your hook will be cut off with &quot;…more&quot;.
            </p>
          )}
        </div>
      )}

      {/* Caption variants */}
      <div className="space-y-3">
        {data.variants.map((v, i) => (
          <VariantCard
            key={i}
            label={v.style || `Variant ${i + 1}`}
            text={v.caption}
            charLimit={INSTAGRAM_LIMIT}
            charWarning="Over Instagram's 2,200 character caption limit."
          />
        ))}
      </div>

      {/* Hashtag chips */}
      {data.hashtags.length > 0 && (
        <div className="glass rounded-xl p-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">Hashtags</span>
          <ChipList items={data.hashtags} prefix="#" />
        </div>
      )}
    </div>
  );
}
