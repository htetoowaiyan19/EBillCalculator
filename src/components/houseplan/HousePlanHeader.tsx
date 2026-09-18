import React, { useState } from 'react';
import {
  Home,
  Globe,
  Sun,
  Moon,
  Zap,
  BarChart3,
  Receipt,
  Hammer,
  Database,
  Copy,
  Check,
  LogOut,
  Users,
} from 'lucide-react';
import { Language, Theme } from '../../types';
import { HousePlanTab, ManagerRole } from '../../types/housePlanTypes';
import { housePlanTranslations } from '../../constants/housePlanTranslations';

interface HousePlanHeaderProps {
  managerName: string;
  managerId: string;
  userRole: ManagerRole;
  lang: Language;
  theme: Theme;
  activeTab: HousePlanTab;
  expenseCount: number;
  completedStagesCount: number;
  totalStagesCount: number;
  onTabChange: (tab: HousePlanTab) => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onSwitchToEbill: () => void;
  onOpenMembersModal: () => void;
  onSwitchManager: () => void;
}

export const HousePlanHeader: React.FC<HousePlanHeaderProps> = ({
  managerName,
  managerId,
  userRole,
  lang,
  theme,
  activeTab,
  expenseCount,
  completedStagesCount,
  totalStagesCount,
  onTabChange,
  onToggleLang,
  onToggleTheme,
  onSwitchToEbill,
  onOpenMembersModal,
  onSwitchManager,
}) => {
  const t = housePlanTranslations[lang];
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(managerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 border-b border-white/50 dark:border-slate-800/80 shadow-sm transition-colors duration-300 no-print">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 pt-3 pb-2">
        {/* Top Branding & Manager Info Bar */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          {/* Left: Branding & Manager Name */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl blur opacity-40 group-hover:opacity-75 transition"></div>
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
                <Home className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[240px]">
                  {managerName}
                </h1>

                {/* 8-Digit Manager ID Pill */}
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 active:scale-95 transition"
                  title="Click to copy 8-Digit Manager ID"
                >
                  <span>ID: {managerId}</span>
                  {copied ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                </button>

                {/* Role Badge */}
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md ${
                    userRole === 'admin'
                      ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                      : userRole === 'editor'
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Members & Permissions Button */}
            <button
              type="button"
              onClick={onOpenMembersModal}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:shadow-sm active:scale-95 transition flex items-center gap-1"
              title={t.manageMembersBtn}
            >
              <Users className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden md:inline">{t.manageMembersBtn}</span>
            </button>

            {/* Switch Manager Button */}
            <button
              type="button"
              onClick={onSwitchManager}
              className="p-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 active:scale-95 transition"
              title={t.switchManager}
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>

            {/* Quick Switch to E-Bill */}
            <button
              type="button"
              onClick={onSwitchToEbill}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 hover:shadow-sm active:scale-95 transition"
              title={t.switchToEbillTooltip}
            >
              <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400 fill-current" />
              <span className="hidden sm:inline text-[11px]">{t.switchToEbillButton}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={onToggleLang}
              type="button"
              className="px-2.5 py-1.5 rounded-full text-[11px] font-bold bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-sm active:scale-95 transition"
              title="Change Language"
            >
              <Globe className="w-3 h-3 text-amber-500 inline mr-1" />
              <span>{lang === 'MY' ? 'EN' : 'မြန်မာ'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              type="button"
              className="p-1.5 rounded-full text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm active:scale-95 transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700 fill-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none">
          {/* Tab: Overview */}
          <button
            type="button"
            onClick={() => onTabChange('overview')}
            className={`flex-1 min-w-[85px] sm:min-w-[110px] flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="truncate">{t.tabOverview}</span>
          </button>

          {/* Tab: Expenses */}
          <button
            type="button"
            onClick={() => onTabChange('expenses')}
            className={`flex-1 min-w-[90px] sm:min-w-[120px] flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 ${
              activeTab === 'expenses'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span className="truncate">{t.tabExpenses}</span>
            <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
              {expenseCount}
            </span>
          </button>

          {/* Tab: Stages */}
          <button
            type="button"
            onClick={() => onTabChange('stages')}
            className={`flex-1 min-w-[90px] sm:min-w-[120px] flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 ${
              activeTab === 'stages'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Hammer className="w-3.5 h-3.5" />
            <span className="truncate">{t.tabStages}</span>
            <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              {completedStagesCount}/{totalStagesCount}
            </span>
          </button>

          {/* Tab: Data & Team */}
          <button
            type="button"
            onClick={() => onTabChange('data')}
            className={`flex-1 min-w-[85px] sm:min-w-[110px] flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs sm:text-sm font-black transition-all duration-200 ${
              activeTab === 'data'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="truncate">{t.tabData}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
