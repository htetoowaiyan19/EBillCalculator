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
    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-sm sm:text-base font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs flex items-center justify-center font-black">
            3
          </span>
          <span className="tracking-tight">{t.step3Title}</span>
        </h2>
      </div>

      {/* Inputs: Streamlined without redundant nested box wrappers */}
      <div className="space-y-4">
        {/* Total Bill Input */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 px-0.5 flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.totalBillLabel}</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.totalBill}
            onChange={(e) => onInputChange('totalBill', e.target.value)}
            placeholder="80000"
            className="w-full text-xl sm:text-2xl font-black px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition tracking-tight"
          />
        </div>

        {/* Shared Users Headcount */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 truncate">
                {t.sharedUsersLabel}
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate block">
                {t.sharedUsersHelp}
              </span>
            </div>
          </div>

          <div className="w-20 shrink-0">
            <input
              type="number"
              min="1"
              max="20"
              value={inputs.sharedUsers}
              onChange={(e) => onInputChange('sharedUsers', e.target.value)}
              placeholder="-"
              className="w-full text-center text-base sm:text-lg font-black py-2 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
