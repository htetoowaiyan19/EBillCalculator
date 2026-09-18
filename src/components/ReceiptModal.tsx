import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const t = translations[lang];

  return (
    <AnimatePresence>
      {isOpen && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md no-print"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative z-10 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 w-full max-w-md rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
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
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mt-1">
                    {data.dateStr}
                  </span>
                </div>

                {/* Overall Stats Table */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">{t.totalBillLabel} :</span>
                    <span className="font-black text-slate-900 dark:text-slate-100">
                      {toCurrency(data.totalBill, t.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">{t.totalUnitsUsed} :</span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      {formatNumber(data.totalUnits)} {t.units}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">{t.ratePerUnit} :</span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">
                      {formatNumber(data.ratePerUnit)} {t.currency}
                    </span>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="pt-2 space-y-2">
                  {/* Person 1 Row */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">{data.p1Name}</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {toCurrency(data.finalP1, t.currency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {formatNumber(data.dP1)} {t.units} ({formatNumber(data.costP1)} {t.currency}) + {t.sharedShare} ({formatNumber(data.sharedPerUser)} {t.currency})
                    </div>
                  </div>

                  {/* Person 2 Row */}
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span className="font-extrabold text-blue-600 dark:text-blue-400">{data.p2Name}</span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        {toCurrency(data.finalP2, t.currency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {formatNumber(data.dP2)} {t.units} ({formatNumber(data.costP2)} {t.currency}) + {t.sharedShare} ({formatNumber(data.sharedPerUser)} {t.currency})
                    </div>
                  </div>

                  {/* Shared Meter Row */}
                  <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-600 dark:text-slate-400">{t.sharedMeter} ({data.sharedUsers} {t.personWord}) :</span>
                      <span className="font-extrabold text-cyan-600 dark:text-cyan-400">
                        {toCurrency(data.costShared, t.currency)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {t.perUserCost} : {toCurrency(data.sharedPerUser, t.currency)}
                    </div>
                  </div>
                </div>

                {/* Footer Notes */}
                <div className="text-center text-[11px] text-slate-400 dark:text-slate-500 pt-1 font-medium">
                  © E-Bill Calculator | {lang === 'MY' ? 'ကျေးဇူးတင်ပါသည်' : 'Thank you'}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between no-print">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
              >
                {t.receiptClose}
              </button>

              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onCopyText}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.receiptCopyText}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.receiptPrint}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
