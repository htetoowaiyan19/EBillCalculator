import React from 'react';
import { CheckCircle2, MessageSquare, Receipt, User, Droplets, ArrowRight } from 'lucide-react';
import { CalculationRecord, Language } from '../types';
import { translations } from '../constants/translations';
import { formatNumber, toCurrency } from '../utils/calculation';

interface ResultsCardProps {
  data: CalculationRecord;
  lang: Language;
  onCopyViber: () => void;
  onOpenReceipt: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  data,
  lang,
  onCopyViber,
  onOpenReceipt,
}) => {
  const t = translations[lang];

  return (
    <div className="backdrop-blur-2xl bg-white/85 dark:bg-slate-900/85 rounded-3xl border border-white/70 dark:border-slate-800/90 shadow-2xl shadow-emerald-500/10 overflow-hidden transition-all duration-300 relative animate-in fade-in slide-in-from-bottom-4">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white px-5 sm:px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-100" />
          </div>
          <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
            {t.resultsTitle}
          </h3>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
          {data.dateStr}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-5 relative z-10">
        {/* Overview Stats Glass Banner */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-inner text-center">
          <div className="border-r border-slate-200 dark:border-slate-800 pr-2">
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">
              {t.totalUnitsUsed}
            </span>
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {formatNumber(data.totalUnits)} <span className="text-xs font-bold text-slate-400">{t.units}</span>
            </span>
          </div>
          <div className="pl-2">
            <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-0.5">
              {t.ratePerUnit}
            </span>
            <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {formatNumber(data.ratePerUnit)} <span className="text-xs font-bold text-slate-400">{t.currency}</span>
            </span>
          </div>
        </div>

        {/* Individual Breakdown Cards */}
        <div>
          <h4 className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            {t.summaryTitle}
          </h4>

          <div className="space-y-3">
            {/* Person 1 Card */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border-l-4 border-blue-600 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 truncate">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{data.p1Name}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {formatNumber(data.dP1)} {t.units} ({formatNumber(data.costP1)} {t.currency}) + {t.sharedShare} ({formatNumber(data.sharedPerUser)} {t.currency})
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {toCurrency(data.finalP1, t.currency)}
                </span>
              </div>
            </div>

            {/* Person 2 Card */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border-l-4 border-blue-600 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 truncate">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{data.p2Name}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {formatNumber(data.dP2)} {t.units} ({formatNumber(data.costP2)} {t.currency}) + {t.sharedShare} ({formatNumber(data.sharedPerUser)} {t.currency})
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="block text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {toCurrency(data.finalP2, t.currency)}
                </span>
              </div>
            </div>

            {/* Shared Meter Card */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border-l-4 border-cyan-500 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold text-cyan-600 dark:text-cyan-400 truncate">
                  <Droplets className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{data.sharedName}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  {formatNumber(data.dShared)} {t.units} = {formatNumber(data.costShared)} {t.currency} ({data.sharedUsers} {t.personWord})
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {t.perUserCost}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-cyan-600 dark:text-cyan-400">
                  {toCurrency(data.sharedPerUser, t.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {/* Copy for Viber */}
          <button
            type="button"
            onClick={onCopyViber}
            className="flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl font-black text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] shadow-lg shadow-purple-500/25 transition-all duration-200 group"
          >
            <MessageSquare className="w-5 h-5 fill-current group-hover:scale-110 transition duration-200" />
            <span className="text-sm sm:text-base tracking-tight">{t.copyViber}</span>
          </button>

          {/* View Receipt Slip */}
          <button
            type="button"
            onClick={onOpenReceipt}
            className="flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-black text-sm sm:text-base text-blue-600 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-[0.98] shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <Receipt className="w-5 h-5 group-hover:scale-110 transition duration-200" />
            <span className="tracking-tight">{t.viewReceipt}</span>
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
