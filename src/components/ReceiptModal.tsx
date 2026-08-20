import React from 'react';
import { X, Printer, Copy } from 'lucide-react';
import { CalculationRecord, Language } from '../types';
import { translations } from '../constants/translations';
import { formatNumber, toCurrency } from '../utils/calculation';

interface ReceiptModalProps {
  isOpen: boolean;
  data: CalculationRecord | null;
  lang: Language;
  onClose: () => void;
  onCopyText: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  data,
  lang,
  onClose,
  onCopyText,
}) => {
  if (!isOpen || !data) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 w-full max-w-md rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>⚡</span>
            <span>{t.receiptTitle}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Slip Area */}
        <div id="printableSlipArea" className="p-4 sm:p-6 overflow-y-auto">
          <div className="p-5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 space-y-4 font-burmese shadow-sm">
            {/* Slip Title & Date */}
            <div className="text-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-lg font-black text-blue-600 dark:text-blue-400">
                ⚡ {t.receiptTitle}
              </h4>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.receiptDate}: {data.dateStr}
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold">
                    <th className="py-2.5 px-2 text-left rounded-l-lg">{t.tableColName}</th>
                    <th className="py-2.5 px-1">{t.tableColPrev}</th>
                    <th className="py-2.5 px-1">{t.tableColCurr}</th>
                    <th className="py-2.5 px-1">{t.tableColUnits}</th>
                    <th className="py-2.5 px-2 text-right rounded-r-lg">{t.tableColAmount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 dark:divide-slate-700/80">
                  <tr>
                    <td className="py-2.5 px-2 text-left font-bold text-blue-600 dark:text-blue-400">{data.p1Name}</td>
                    <td className="py-2.5 px-1 text-slate-600 dark:text-slate-300 font-medium">{formatNumber(data.p1Prev)}</td>
                    <td className="py-2.5 px-1 text-slate-600 dark:text-slate-300 font-medium">{formatNumber(data.p1Current)}</td>
                    <td className="py-2.5 px-1 font-bold text-blue-600 dark:text-blue-400">+{formatNumber(data.dP1)}</td>
                    <td className="py-2.5 px-2 text-right font-black text-emerald-600 dark:text-emerald-400">{toCurrency(data.finalP1, t.currency)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 text-left font-bold text-blue-600 dark:text-blue-400">{data.p2Name}</td>
                    <td className="py-2.5 px-1 text-slate-600 dark:text-slate-300 font-medium">{formatNumber(data.p2Prev)}</td>
                    <td className="py-2.5 px-1 text-slate-600 dark:text-slate-300 font-medium">{formatNumber(data.p2Current)}</td>
                    <td className="py-2.5 px-1 font-bold text-blue-600 dark:text-blue-400">+{formatNumber(data.dP2)}</td>
                    <td className="py-2.5 px-2 text-right font-black text-emerald-600 dark:text-emerald-400">{toCurrency(data.finalP2, t.currency)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-2 text-left font-bold text-cyan-600 dark:text-cyan-400">{data.sharedName}</td>
                    <td className="py-2.5 px-1 text-slate-600 dark:text-slate-300 font-medium">{formatNumber(data.sharedPrev)}</td>
                    <td className="py-2.5 px-1 text-slate-600 dark:text-slate-300 font-medium">{formatNumber(data.sharedCurrent)}</td>
                    <td className="py-2.5 px-1 font-bold text-cyan-600 dark:text-cyan-400">+{formatNumber(data.dShared)}</td>
                    <td className="py-2.5 px-2 text-right text-xs text-slate-500 dark:text-slate-400 font-semibold">{toCurrency(data.sharedPerUser, t.currency)} / {t.personWord}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Subtotal & Breakdown */}
            <div className="p-3.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 text-xs space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">{t.sharedMeter} ({data.sharedUsers} {t.personWord}) :</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatNumber(data.costShared)} {t.currency}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">{t.ratePerUnit} :</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{formatNumber(data.ratePerUnit)} {t.currency}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-700 text-sm font-black text-emerald-600 dark:text-emerald-400">
                <span>{t.totalBillResult} :</span>
                <span>{toCurrency(data.totalBill, t.currency)}</span>
              </div>
            </div>

            <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-1 font-medium">
              © E-Bill Calculator | {lang === 'MY' ? 'ကျေးဇူးတင်ပါသည်' : 'Thank you'}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between gap-2 no-print">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            {t.receiptClose}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCopyText}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{t.receiptCopyText}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.receiptPrint}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
