'use client';

import type { InvoiceOutput } from '@/lib/schemas';
import { downloadTextFile, invoiceToText } from '@/lib/exporters/text';
import { ActionButton, CopyIcon, DownloadIcon, PrintIcon, ScaledPaper, useCopy } from './shared';

interface Props {
  data: InvoiceOutput;
}

export default function InvoiceRenderer({ data }: Props) {
  const copy = useCopy();
  const c = data.currency || '$';

  // Never trust model arithmetic: recompute totals from the line items.
  const subtotal = data.items.reduce((sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0), 0);
  const taxRate = Number.isFinite(data.taxRate) && data.taxRate > 0 ? data.taxRate : 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const money = (n: number) =>
    `${c}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      <div className="no-print flex flex-wrap gap-2 justify-end">
        <ActionButton onClick={() => copy(invoiceToText(data))}>{CopyIcon} Copy</ActionButton>
        <ActionButton onClick={() => window.print()} title="Print → Save as PDF" primary>
          {PrintIcon} Print / PDF
        </ActionButton>
        <ActionButton onClick={() => downloadTextFile(`${data.invoiceNumber || 'invoice'}.txt`, invoiceToText(data))}>
          {DownloadIcon} TXT
        </ActionButton>
      </div>

      <ScaledPaper>
        <div
          className="print-area bg-white text-gray-900 min-h-[1123px] shadow-2xl flex flex-col"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {/* Header */}
          <div className="px-12 py-9 flex items-start justify-between print-exact" style={{ backgroundColor: '#111827' }}>
            <div>
              <h1 className="text-[26px] font-extrabold tracking-wide text-white">INVOICE</h1>
              <p className="text-gray-400 text-[12px] mt-0.5">{data.invoiceNumber}</p>
            </div>
            <div className="text-right text-[12px] text-gray-300 space-y-0.5">
              <p>
                <span className="text-gray-500">Issued: </span>
                {data.issueDate}
              </p>
              <p>
                <span className="text-gray-500">Due: </span>
                {data.dueDate}
              </p>
            </div>
          </div>

          <div className="px-12 py-8 flex-1">
            {/* Parties */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[2px] text-gray-400 mb-1.5">From</p>
                <p className="text-[13.5px] font-bold">{data.from.name}</p>
                {data.from.addressLines.map((line, i) => (
                  <p key={i} className="text-[12px] text-gray-600 leading-relaxed">{line}</p>
                ))}
              </div>
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[2px] text-gray-400 mb-1.5">Bill To</p>
                <p className="text-[13.5px] font-bold">{data.to.name}</p>
                {data.to.addressLines.map((line, i) => (
                  <p key={i} className="text-[12px] text-gray-600 leading-relaxed">{line}</p>
                ))}
              </div>
            </div>

            {/* Items */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-2.5 text-[10.5px] font-bold uppercase tracking-[1.5px] text-gray-500">Description</th>
                  <th className="text-right py-2.5 text-[10.5px] font-bold uppercase tracking-[1.5px] text-gray-500 w-16">Qty</th>
                  <th className="text-right py-2.5 text-[10.5px] font-bold uppercase tracking-[1.5px] text-gray-500 w-28">Rate</th>
                  <th className="text-right py-2.5 text-[10.5px] font-bold uppercase tracking-[1.5px] text-gray-500 w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="py-3 text-[12.5px]">{item.description}</td>
                    <td className="py-3 text-[12.5px] text-right tabular-nums">{item.quantity}</td>
                    <td className="py-3 text-[12.5px] text-right tabular-nums">{money(item.rate)}</td>
                    <td className="py-3 text-[12.5px] text-right tabular-nums font-medium">{money(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mt-4">
              <div className="w-72 space-y-1.5">
                <div className="flex justify-between text-[12.5px] text-gray-600">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{money(subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-[12.5px] text-gray-600">
                    <span>Tax ({taxRate}%)</span>
                    <span className="tabular-nums">{money(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[15px] font-extrabold border-t-2 border-gray-900 pt-2">
                  <span>Total</span>
                  <span className="tabular-nums">{money(total)}</span>
                </div>
              </div>
            </div>

            {/* Terms */}
            {(data.paymentTerms || data.notes) && (
              <div className="mt-10 pt-5 border-t border-gray-200 text-[12px] text-gray-600 space-y-1">
                {data.paymentTerms && (
                  <p>
                    <span className="font-semibold text-gray-800">Payment terms: </span>
                    {data.paymentTerms}
                  </p>
                )}
                {data.notes && <p>{data.notes}</p>}
              </div>
            )}
          </div>

          <div className="px-12 py-5 text-center text-[11px] text-gray-400 border-t border-gray-100">
            Thank you for your business
          </div>
        </div>
      </ScaledPaper>
    </div>
  );
}
