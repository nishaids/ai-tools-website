'use client';

import { useEffect, useState } from 'react';
import type { Tool } from '@/lib/tools';

/**
 * Loading state that previews the shape of the actual output template
 * (resume skeleton for resumes, table for invoices, cards for variants…)
 * with rotating status messages. No blank spinners.
 */

const STATUS_MESSAGES: Record<Tool['outputFormat'], string[]> = {
  resume: ['Analyzing your experience…', 'Quantifying your achievements…', 'Optimizing for ATS…', 'Polishing the layout…'],
  email: ['Studying the context…', 'Drafting your message…', 'Tightening every sentence…'],
  invoice: ['Itemizing your services…', 'Calculating totals…', 'Formatting the invoice…'],
  social: ['Finding the right angle…', 'Writing scroll-stopping copy…', 'Picking the best hashtags…'],
  script: ['Structuring the story…', 'Writing your hook…', 'Timing the sections…'],
  text: ['Brainstorming ideas…', 'Ranking the best options…', 'Refining the winners…'],
};

export default function OutputSkeleton({ format }: { format: Tool['outputFormat'] }) {
  const messages = STATUS_MESSAGES[format] ?? STATUS_MESSAGES.text;
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="space-y-5 py-2">
      <div className="flex items-center justify-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <p key={messageIndex} className="text-sm text-gray-300 font-medium animate-fade-in">
          {messages[messageIndex]}
        </p>
      </div>

      {format === 'resume' && <ResumeSkeleton />}
      {(format === 'email' || format === 'script') && <DocumentSkeleton />}
      {format === 'invoice' && <TableSkeleton />}
      {(format === 'social' || format === 'text') && <CardsSkeleton />}
    </div>
  );
}

function ResumeSkeleton() {
  return (
    <div className="bg-white/[0.04] rounded-xl p-6 flex gap-5">
      {/* sidebar */}
      <div className="w-1/3 space-y-3">
        <div className="skeleton h-6 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="skeleton h-3 w-full mt-6" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-3 w-4/6" />
        <div className="skeleton h-3 w-full mt-6" />
        <div className="skeleton h-3 w-3/4" />
      </div>
      {/* main */}
      <div className="flex-1 space-y-3">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-4 w-1/3 mt-5" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-4/6" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-3/6" />
      </div>
    </div>
  );
}

function DocumentSkeleton() {
  return (
    <div className="bg-white/[0.04] rounded-xl p-6 space-y-3">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-3 w-1/3 mb-4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-5/6" />
      <div className="skeleton h-3 w-full mt-4" />
      <div className="skeleton h-3 w-4/6" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white/[0.04] rounded-xl p-6 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton h-6 w-1/4" />
        <div className="skeleton h-6 w-1/5" />
      </div>
      <div className="flex gap-4 mt-4">
        <div className="skeleton h-3 flex-[3]" />
        <div className="skeleton h-3 flex-1" />
        <div className="skeleton h-3 flex-1" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="skeleton h-4 flex-[3]" />
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 flex-1" />
        </div>
      ))}
      <div className="flex justify-end mt-3">
        <div className="skeleton h-5 w-1/3" />
      </div>
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white/[0.04] rounded-xl p-4 space-y-2.5">
          <div className="flex justify-between">
            <div className="skeleton h-3 w-1/5" />
            <div className="skeleton h-3 w-12" />
          </div>
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}
