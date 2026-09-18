import React from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-lg overflow-hidden"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
            {t.resultsTitle}
          </h3>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white">
          {data.dateStr}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Overview Stats Row */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
          <div className="border-r border-slate-200 dark:border-slate-700 pr-2">
            <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
              {t.totalUnitsUsed}
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {formatNumber(data.totalUnits)} <span className="text-[11px] font-bold text-slate-400">{t.units}</span>
            </span>
          </div>
          <div className="pl-2">
            <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">
              {t.ratePerUnit}
            </span>
            <span className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {formatNumber(data.ratePerUnit)} <span className="text-[11px] font-bold text-slate-400">{t.currency}</span>
            </span>
          </div>
        </div>

        {/* Individual Breakdown List */}
        <div className="space-y-2.5">
          {/* Person 1 Card */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border-l-4 border-l-blue-600 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 truncate">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{data.p1Name}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {formatNumber(data.dP1)} {t.units} ({formatNumber(data.costP1)} {t.currency}) + {t.sharedShare} ({formatNumber(data.sharedPerUser)} {t.currency})
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="block text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {toCurrency(data.finalP1, t.currency)}
              </span>
            </div>
          </div>

          {/* Person 2 Card */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border-l-4 border-l-blue-600 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 truncate">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{data.p2Name}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {formatNumber(data.dP2)} {t.units} ({formatNumber(data.costP2)} {t.currency}) + {t.sharedShare} ({formatNumber(data.sharedPerUser)} {t.currency})
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="block text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {toCurrency(data.finalP2, t.currency)}
              </span>
            </div>
          </div>

          {/* Shared Meter Card */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border-l-4 border-l-cyan-500 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 truncate">
                <Droplets className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{data.sharedName}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {formatNumber(data.dShared)} {t.units} = {formatNumber(data.costShared)} {t.currency} ({data.sharedUsers} {t.personWord})
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500">
                {t.perUserCost}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-cyan-600 dark:text-cyan-400">
                {toCurrency(data.sharedPerUser, t.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons with Spring Micro-Interactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onCopyViber}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.copyViber}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onOpenReceipt}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
          >
            <Receipt className="w-4 h-4" />
            <span>{t.viewReceipt}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5 text-blue-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
