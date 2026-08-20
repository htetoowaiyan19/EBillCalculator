import React from 'react';
import { Trash2, ArrowUpRight, Calendar, Inbox, Cloud, HardDrive } from 'lucide-react';
import { CalculationRecord, Language } from '../types';
import { translations } from '../constants/translations';
import { formatNumber, toCurrency } from '../utils/calculation';

interface HistorySectionProps {
  history: CalculationRecord[];
  lang: Language;
  isCloudMode: boolean;
  onLoadRecord: (record: CalculationRecord) => void;
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  lang,
  isCloudMode,
  onLoadRecord,
  onDeleteRecord,
  onClearAll,
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-1 flex-wrap">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {t.historyTitle}
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-sm ${
              isCloudMode
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
            }`}
          >
            {isCloudMode ? (
              <>
                <Cloud className="w-3.5 h-3.5 text-blue-500" />
                <span>Cloud</span>
              </>
            ) : (
              <>
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span>Local</span>
              </>
            )}
          </span>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 hover:bg-rose-100 dark:hover:bg-rose-900/50 shadow-sm active:scale-95 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.deleteAll}</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/75 dark:bg-slate-900/75 rounded-3xl border border-white/60 dark:border-slate-800/80 p-10 text-center text-slate-400 dark:text-slate-500 space-y-3 shadow-glass">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <Inbox className="w-8 h-8" />
          </div>
          <p className="text-sm font-semibold max-w-xs mx-auto leading-relaxed">
            {t.noHistory}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl border border-white/60 dark:border-slate-800/80 p-4 sm:p-5 shadow-glass dark:shadow-glass-dark hover:shadow-glass-hover transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100/80 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {item.dateStr}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onLoadRecord(item)}
                    className="p-2 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 shadow-sm active:scale-90 transition"
                    title={t.loadToCalc}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteRecord(item.id)}
                    className="p-2 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 shadow-sm active:scale-90 transition"
                    title={t.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Record Summary */}
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-semibold">
                <div className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60">
                  <span className="block text-slate-400 text-[11px] mb-0.5">{item.p1Name}</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{toCurrency(item.finalP1, t.currency)}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60">
                  <span className="block text-slate-400 text-[11px] mb-0.5">{item.p2Name}</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{toCurrency(item.finalP2, t.currency)}</strong>
                </div>
                <div className="col-span-2 text-xs text-slate-500 dark:text-slate-400 pt-1 flex justify-between items-center">
                  <span>{t.totalBillResult}: <strong className="text-slate-800 dark:text-slate-200 font-bold">{toCurrency(item.totalBill, t.currency)}</strong></span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">{formatNumber(item.totalUnits)} {t.units}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
