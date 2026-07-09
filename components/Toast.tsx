'use client';

import { useEffect, useState } from 'react';

/**
 * Tiny event-based toast system — no context plumbing, no dependencies.
 * Call toast('Copied!') from anywhere; <Toaster /> (mounted once per page)
 * renders the stack.
 */

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const EVENT_NAME = 'app-toast';

export function toast(message: string, type: ToastType = 'success'): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { message, type } }));
}

const TYPE_STYLES: Record<ToastType, string> = {
  success: 'bg-green-500 shadow-green-500/30',
  error: 'bg-red-500 shadow-red-500/30',
  info: 'bg-violet-500 shadow-violet-500/30',
};

const TYPE_ICONS: Record<ToastType, JSX.Element> = {
  success: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let nextId = 1;
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent<{ message: string; type: ToastType }>).detail;
      const id = nextId++;
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2500);
    };
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 no-print">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-5 py-3 text-white rounded-xl shadow-lg font-medium text-sm animate-fade-in ${TYPE_STYLES[t.type]}`}
        >
          {TYPE_ICONS[t.type]}
          {t.message}
        </div>
      ))}
    </div>
  );
}
