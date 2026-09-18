import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          colorClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        };
      }
      return {
        text: `${formatNumber(diff)} ${t.units}`,
        colorClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      };
    }
    return {
      text: `-- ${t.units}`,
      colorClass: 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700',
    };
  };

  const p1Badge = computeBadge(inputs.p1Current, inputs.p1Prev);
  const p2Badge = computeBadge(inputs.p2Current, inputs.p2Prev);
  const sharedBadge = computeBadge(inputs.sharedCurrent, inputs.sharedPrev);

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative">
      {/* Step Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-sm sm:text-base font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-black">
            1
          </span>
          <span className="tracking-tight">{t.step1Title}</span>
        </h2>

        <button
          type="button"
          onClick={() => setShowNamesEdit(!showNamesEdit)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{t.customNamesToggle}</span>
          {showNamesEdit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Custom Names with Fluid Animation */}
      <AnimatePresence>
        {showNamesEdit && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="mb-4"
          >
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t.person1}
                </label>
                <input
                  type="text"
                  value={names.p1}
                  onChange={(e) => onNameChange('p1', e.target.value)}
                  placeholder={t.person1NamePlaceholder}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t.person2}
                </label>
                <input
                  type="text"
                  value={names.p2}
                  onChange={(e) => onNameChange('p2', e.target.value)}
                  placeholder={t.person2NamePlaceholder}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {t.sharedMeter}
                </label>
                <input
                  type="text"
                  value={names.shared}
                  onChange={(e) => onNameChange('shared', e.target.value)}
                  placeholder={t.sharedMeterNamePlaceholder}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inputs: Streamlined without redundant nested box wrappers */}
      <div className="space-y-3.5">
        {/* Person 1 */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="truncate">{names.p1.trim() || t.person1}</span>
            </label>
            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${p1Badge.colorClass} transition-all`}>
              {p1Badge.text}
            </span>
          </div>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.p1Current}
            onChange={(e) => onInputChange('p1Current', e.target.value)}
            placeholder="220"
            className="w-full text-lg sm:text-xl font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
          />
        </div>

        {/* Person 2 */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="truncate">{names.p2.trim() || t.person2}</span>
            </label>
            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${p2Badge.colorClass} transition-all`}>
              {p2Badge.text}
            </span>
          </div>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.p2Current}
            onChange={(e) => onInputChange('p2Current', e.target.value)}
            placeholder="200"
            className="w-full text-lg sm:text-xl font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition"
          />
        </div>

        {/* Shared Meter */}
        <div>
          <div className="flex items-center justify-between mb-1.5 px-0.5">
            <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="truncate">{names.shared.trim() || t.sharedMeter}</span>
            </label>
            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md border ${sharedBadge.colorClass} transition-all`}>
              {sharedBadge.text}
            </span>
          </div>
          <input
            type="number"
            inputMode="decimal"
            value={inputs.sharedCurrent}
            onChange={(e) => onInputChange('sharedCurrent', e.target.value)}
            placeholder="150"
            className="w-full text-lg sm:text-xl font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );
};
