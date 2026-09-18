import React from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  History,
  CloudDownload,
  BarChart3,
  Receipt,
  Hammer,
  Database,
} from 'lucide-react';
import { ActiveTab, Language } from '../../types';
import { HousePlanTab } from '../../types/housePlanTypes';
import { translations } from '../../constants/translations';
import { housePlanTranslations } from '../../constants/housePlanTranslations';

export type BottomNavMode =
  | {
      type: 'ebill';
      activeTab: ActiveTab;
      onTabChange: (tab: ActiveTab) => void;
      historyCount?: number;
    }
  | {
      type: 'houseplan';
      activeTab: HousePlanTab;
      onTabChange: (tab: HousePlanTab) => void;
      expenseCount?: number;
      completedStagesCount?: number;
      totalStagesCount?: number;
    };

interface BottomNavBarProps {
  mode: BottomNavMode;
  lang: Language;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ mode, lang }) => {
  const tEbill = translations[lang];
  const tHouse = housePlanTranslations[lang];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-white/90 dark:bg-slate-950/90 border-t border-slate-200/80 dark:border-slate-800/90 shadow-2xl transition-colors duration-300 no-print"
    >
      <div className="max-w-md mx-auto px-2 pt-1.5 pb-2 sm:pb-2.5 flex items-center justify-around gap-1">
        {mode.type === 'ebill' ? (
          <>
            {/* E-Bill Tab 1: Calculator */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => mode.onTabChange('calc')}
              className={`relative flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                mode.activeTab === 'calc'
                  ? 'text-blue-600 dark:text-blue-400 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
              }`}
            >
              {mode.activeTab === 'calc' && (
                <motion.div
                  layoutId="ebillActiveTabPill"
                  className="absolute inset-0 bg-blue-500/12 dark:bg-blue-500/20 rounded-2xl border border-blue-500/20 shadow-sm pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 w-9 h-6 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="relative z-10 text-[10px] tracking-tight">{tEbill.tabCalculator}</span>
            </motion.button>

            {/* E-Bill Tab 2: History */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => mode.onTabChange('history')}
              className={`relative flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                mode.activeTab === 'history'
                  ? 'text-blue-600 dark:text-blue-400 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
              }`}
            >
              {mode.activeTab === 'history' && (
                <motion.div
                  layoutId="ebillActiveTabPill"
                  className="absolute inset-0 bg-blue-500/12 dark:bg-blue-500/20 rounded-2xl border border-blue-500/20 shadow-sm pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 w-9 h-6 flex items-center justify-center">
                <History className="w-5 h-5" />
                {mode.historyCount !== undefined && mode.historyCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {mode.historyCount}
                  </span>
                )}
              </div>
              <span className="relative z-10 text-[10px] tracking-tight">{tEbill.tabHistory}</span>
            </motion.button>

            {/* E-Bill Tab 3: Backup */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => mode.onTabChange('backup')}
              className={`relative flex-1 py-1.5 px-2 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                mode.activeTab === 'backup'
                  ? 'text-blue-600 dark:text-blue-400 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
              }`}
            >
              {mode.activeTab === 'backup' && (
                <motion.div
                  layoutId="ebillActiveTabPill"
                  className="absolute inset-0 bg-blue-500/12 dark:bg-blue-500/20 rounded-2xl border border-blue-500/20 shadow-sm pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 w-9 h-6 flex items-center justify-center">
                <CloudDownload className="w-5 h-5" />
              </div>
              <span className="relative z-10 text-[10px] tracking-tight">{tEbill.tabBackup}</span>
            </motion.button>
          </>
        ) : (
          <>
            {/* HousePlan Tab 1: Overview */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => mode.onTabChange('overview')}
              className={`relative flex-1 py-1.5 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                mode.activeTab === 'overview'
                  ? 'text-amber-600 dark:text-amber-400 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
              }`}
            >
              {mode.activeTab === 'overview' && (
                <motion.div
                  layoutId="houseplanActiveTabPill"
                  className="absolute inset-0 bg-amber-500/12 dark:bg-amber-500/20 rounded-2xl border border-amber-500/25 shadow-sm pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 w-9 h-6 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="relative z-10 text-[10px] tracking-tight truncate max-w-[70px]">
                {tHouse.tabOverview}
              </span>
            </motion.button>

            {/* HousePlan Tab 2: Expenses */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => mode.onTabChange('expenses')}
              className={`relative flex-1 py-1.5 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                mode.activeTab === 'expenses'
                  ? 'text-amber-600 dark:text-amber-400 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
              }`}
            >
              {mode.activeTab === 'expenses' && (
                <motion.div
                  layoutId="houseplanActiveTabPill"
                  className="absolute inset-0 bg-amber-500/12 dark:bg-amber-500/20 rounded-2xl border border-amber-500/25 shadow-sm pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 w-9 h-6 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
                {mode.expenseCount !== undefined && mode.expenseCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-amber-600 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {mode.expenseCount}
                  </span>
                )}
              </div>
              <span className="relative z-10 text-[10px] tracking-tight truncate max-w-[70px]">
                {tHouse.tabExpenses}
              </span>
            </motion.button>

            {/* HousePlan Tab 3: Stages */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => mode.onTabChange('stages')}
              className={`relative flex-1 py-1.5 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                mode.activeTab === 'stages'
                  ? 'text-amber-600 dark:text-amber-400 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
              }`}
            >
              {mode.activeTab === 'stages' && (
                <motion.div
                  layoutId="houseplanActiveTabPill"
                  className="absolute inset-0 bg-amber-500/12 dark:bg-amber-500/20 rounded-2xl border border-amber-500/25 shadow-sm pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 w-9 h-6 flex items-center justify-center">
                <Hammer className="w-5 h-5" />
                {mode.completedStagesCount !== undefined && mode.totalStagesCount !== undefined && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {mode.completedStagesCount}/{mode.totalStagesCount}
                  </span>
                )}
              </div>
              <span className="relative z-10 text-[10px] tracking-tight truncate max-w-[70px]">
                {tHouse.tabStages}
              </span>
            </motion.button>

            {/* HousePlan Tab 4: Data & Team */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => mode.onTabChange('data')}
              className={`relative flex-1 py-1.5 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-colors duration-200 ${
                mode.activeTab === 'data'
                  ? 'text-amber-600 dark:text-amber-400 font-black'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold'
              }`}
            >
              {mode.activeTab === 'data' && (
                <motion.div
                  layoutId="houseplanActiveTabPill"
                  className="absolute inset-0 bg-amber-500/12 dark:bg-amber-500/20 rounded-2xl border border-amber-500/25 shadow-sm pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
              <div className="relative z-10 w-9 h-6 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <span className="relative z-10 text-[10px] tracking-tight truncate max-w-[70px]">
                {tHouse.tabData}
              </span>
            </motion.button>
          </>
        )}
      </div>
    </nav>
  );
};
