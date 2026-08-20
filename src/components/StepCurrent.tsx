import React, { useState } from 'react';
import { User, Droplets, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { CustomNames, Language, MeterInputs } from '../types';
import { translations } from '../constants/translations';
import { formatNumber } from '../utils/calculation';

interface StepCurrentProps {
  inputs: MeterInputs;
  names: CustomNames;
  lang: Language;
  onInputChange: (field: keyof MeterInputs, value: string) => void;
  onNameChange: (field: keyof CustomNames, value: string) => void;
}

export const StepCurrent: React.FC<StepCurrentProps> = ({
  inputs,
  names,
  lang,
  onInputChange,
  onNameChange,
}) => {
  const t = translations[lang];
  const [showNamesEdit, setShowNamesEdit] = useState(false);

  // Compute live unit difference badges
  const computeBadge = (currStr: string, prevStr: string) => {
    const curr = parseFloat(currStr);
    const prev = parseFloat(prevStr);
    if (!isNaN(curr) && !isNaN(prev)) {
      const diff = curr - prev;
      if (diff >= 0) {
        return {
          text: `+${formatNumber(diff)} ${t.units}`,
          colorClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/80 shadow-sm shadow-blue-500/10',
        };
      }
      return {
        text: `${formatNumber(diff)} ${t.units}`,
        colorClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/80 shadow-sm shadow-rose-500/10',
      };
    }
    return {
      text: `-- ${t.units}`,
      colorClass: 'bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/60',
    };
  };

  const p1Badge = computeBadge(inputs.p1Current, inputs.p1Prev);
  const p2Badge = computeBadge(inputs.p2Current, inputs.p2Prev);
  const sharedBadge = computeBadge(inputs.sharedCurrent, inputs.sharedPrev);

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-5 sm:p-6 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark hover:shadow-glass-hover transition-all duration-300 relative overflow-hidden">
      {/* Accent corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-100/80 dark:border-slate-800/80 relative z-10">
        <h2 className="text-base sm:text-lg font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white text-xs flex items-center justify-center font-black shadow-md shadow-blue-500/30">
            1
          </span>
          <span className="tracking-tight">{t.step1Title}</span>
        </h2>

        <button
          type="button"
          onClick={() => setShowNamesEdit(!showNamesEdit)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t.customNamesToggle}</span>
          {showNamesEdit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Custom Names */}
      {showNamesEdit && (
        <div className="mb-4 p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 shadow-inner grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.person1}
            </label>
            <input
              type="text"
              value={names.p1}
              onChange={(e) => onNameChange('p1', e.target.value)}
              placeholder={t.person1NamePlaceholder}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.person2}
            </label>
            <input
              type="text"
              value={names.p2}
              onChange={(e) => onNameChange('p2', e.target.value)}
              placeholder={t.person2NamePlaceholder}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t.sharedMeter}
            </label>
            <input
              type="text"
              value={names.shared}
              onChange={(e) => onNameChange('shared', e.target.value)}
              placeholder={t.sharedMeterNamePlaceholder}
              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            />
          </div>
        </div>
      )}

      {/* Inputs */}
      <div className="space-y-4 relative z-10">
        {/* Person 1 */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{names.p1.trim() || t.person1}</span>
            </label>
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${p1Badge.colorClass} transition-all`}>
              {p1Badge.text}
            </span>
          </div>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.p1Current}
            onChange={(e) => onInputChange('p1Current', e.target.value)}
            placeholder="220"
            className="w-full text-xl sm:text-2xl font-black px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none shadow-sm transition"
          />
        </div>

        {/* Person 2 */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{names.p2.trim() || t.person2}</span>
            </label>
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${p2Badge.colorClass} transition-all`}>
              {p2Badge.text}
            </span>
          </div>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.p2Current}
            onChange={(e) => onInputChange('p2Current', e.target.value)}
            placeholder="200"
            className="w-full text-xl sm:text-2xl font-black px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 focus:outline-none shadow-sm transition"
          />
        </div>

        {/* Shared Meter */}
        <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{names.shared.trim() || t.sharedMeter}</span>
            </label>
            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${sharedBadge.colorClass} transition-all`}>
              {sharedBadge.text}
            </span>
          </div>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.sharedCurrent}
            onChange={(e) => onInputChange('sharedCurrent', e.target.value)}
            placeholder="150"
            className="w-full text-xl sm:text-2xl font-black px-4 py-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/15 focus:outline-none shadow-sm transition"
          />
        </div>
      </div>
    </div>
  );
};
