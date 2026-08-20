import React from 'react';
import { Banknote, Users } from 'lucide-react';
import { Language, MeterInputs } from '../types';
import { translations } from '../constants/translations';

interface StepTotalProps {
  inputs: MeterInputs;
  lang: Language;
  onInputChange: (field: keyof MeterInputs, value: string) => void;
}

export const StepTotal: React.FC<StepTotalProps> = ({
  inputs,
  lang,
  onInputChange,
}) => {
  const t = translations[lang];

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-5 sm:p-6 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark hover:shadow-glass-hover transition-all duration-300 relative overflow-hidden">
      {/* Accent corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-100/80 dark:border-slate-800/80 relative z-10">
        <h2 className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white text-xs flex items-center justify-center font-black shadow-md shadow-emerald-500/30">
            3
          </span>
          <span className="tracking-tight">{t.step3Title}</span>
        </h2>
      </div>

      {/* Inputs */}
      <div className="space-y-4 relative z-10">
        {/* Total Bill Input */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Banknote className="w-3.5 h-3.5" />
            </div>
            <span>{t.totalBillLabel}</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.totalBill}
            onChange={(e) => onInputChange('totalBill', e.target.value)}
            placeholder="80000"
            className="w-full text-2xl sm:text-3xl font-black px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:outline-none shadow-sm transition tracking-tight"
          />
        </div>

        {/* Shared Users Headcount */}
        <div className="flex items-center justify-between gap-3 p-4 bg-slate-50/80 dark:bg-slate-950/40 rounded-2xl border border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shadow-inner">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
                {t.sharedUsersLabel}
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t.sharedUsersHelp}
              </span>
            </div>
          </div>

          <div className="w-20">
            <input
              type="number"
              min="1"
              max="20"
              value={inputs.sharedUsers}
              onChange={(e) => onInputChange('sharedUsers', e.target.value)}
              className="w-full text-center text-lg font-black py-2 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
