import React from 'react';
import { RotateCw, User, Droplets } from 'lucide-react';
import { CustomNames, Language, MeterInputs } from '../types';
import { translations } from '../constants/translations';

interface StepPreviousProps {
  inputs: MeterInputs;
  names: CustomNames;
  lang: Language;
  onInputChange: (field: keyof MeterInputs, value: string) => void;
  onFillPrevious: () => void;
}

export const StepPrevious: React.FC<StepPreviousProps> = ({
  inputs,
  names,
  lang,
  onInputChange,
  onFillPrevious,
}) => {
  const t = translations[lang];

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-5 sm:p-6 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark hover:shadow-glass-hover transition-all duration-300 relative overflow-hidden">
      {/* Accent corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-100/80 dark:border-slate-800/80 flex-wrap relative z-10">
        <h2 className="text-base sm:text-lg font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white text-xs flex items-center justify-center font-black shadow-md shadow-amber-500/30">
            2
          </span>
          <span className="tracking-tight">{t.step2Title}</span>
        </h2>

        <button
          type="button"
          onClick={onFillPrevious}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all duration-200"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{t.fillPrevious}</span>
        </button>
      </div>

      {/* Previous Month Inputs */}
      <div className="space-y-4 relative z-10">
        {/* Person 1 Previous */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">{names.p1.trim() || t.person1} ({lang === 'MY' ? 'ယခင်လ' : 'Previous'})</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.p1Prev}
            onChange={(e) => onInputChange('p1Prev', e.target.value)}
            placeholder="180"
            className="w-full text-xl sm:text-2xl font-black px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 focus:outline-none shadow-sm transition"
          />
        </div>

        {/* Person 2 Previous */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">{names.p2.trim() || t.person2} ({lang === 'MY' ? 'ယခင်လ' : 'Previous'})</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.p2Prev}
            onChange={(e) => onInputChange('p2Prev', e.target.value)}
            placeholder="170"
            className="w-full text-xl sm:text-2xl font-black px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 focus:outline-none shadow-sm transition"
          />
        </div>

        {/* Shared Meter Previous */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">{names.shared.trim() || t.sharedMeter} ({lang === 'MY' ? 'ယခင်လ' : 'Previous'})</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.sharedPrev}
            onChange={(e) => onInputChange('sharedPrev', e.target.value)}
            placeholder="120"
            className="w-full text-xl sm:text-2xl font-black px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 focus:outline-none shadow-sm transition"
          />
        </div>
      </div>
    </div>
  );
};
