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
    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 flex-wrap">
        <h2 className="text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-500 text-white text-xs flex items-center justify-center font-black">
            2
          </span>
          <span className="tracking-tight">{t.step2Title}</span>
        </h2>

        <button
          type="button"
          onClick={onFillPrevious}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white active:scale-95 transition shadow-sm"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{t.fillPrevious}</span>
        </button>
      </div>

      {/* Inputs: Streamlined without redundant nested box wrappers */}
      <div className="space-y-3.5">
        {/* Person 1 Previous */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 px-0.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate">{names.p1.trim() || t.person1} ({lang === 'MY' ? 'ယခင်လ' : 'Previous'})</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.p1Prev}
            onChange={(e) => onInputChange('p1Prev', e.target.value)}
            placeholder="180"
            className="w-full text-lg sm:text-xl font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>

        {/* Person 2 Previous */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 px-0.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate">{names.p2.trim() || t.person2} ({lang === 'MY' ? 'ယခင်လ' : 'Previous'})</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.p2Prev}
            onChange={(e) => onInputChange('p2Prev', e.target.value)}
            placeholder="170"
            className="w-full text-lg sm:text-xl font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>

        {/* Shared Meter Previous */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5 px-0.5 flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate">{names.shared.trim() || t.sharedMeter} ({lang === 'MY' ? 'ယခင်လ' : 'Previous'})</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.sharedPrev}
            onChange={(e) => onInputChange('sharedPrev', e.target.value)}
            placeholder="120"
            className="w-full text-lg sm:text-xl font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );
};
