import React from 'react';
import { Zap, Globe, Sun, Moon, Calculator, History, CloudDownload, LogIn } from 'lucide-react';
import { User } from 'firebase/auth';
import { ActiveTab, Language, Theme } from '../types';
import { translations } from '../constants/translations';

interface HeaderProps {
  lang: Language;
  theme: Theme;
  activeTab: ActiveTab;
  user: User | null;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  theme,
  activeTab,
  user,
  onToggleLang,
  onToggleTheme,
  onTabChange,
  onOpenAuth,
  onOpenAccount,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-2xl bg-white/70 dark:bg-slate-950/70 border-b border-white/50 dark:border-slate-800/80 shadow-sm transition-colors duration-300 no-print">
      <div className="max-w-2xl mx-auto px-4 pt-3.5 pb-2.5">
        {/* Top Branding and Action Controls */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 fill-current animate-pulse" />
              </div>
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 dark:from-white dark:via-blue-100 dark:to-slate-200 bg-clip-text text-transparent leading-snug">
                {t.appTitle}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Pill Switch */}
            <button
              onClick={onToggleLang}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-slate-800 active:scale-95 transition-all duration-200"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>{lang === 'MY' ? 'EN' : 'မြန်မာ'}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              type="button"
              className="p-2 rounded-full text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-slate-800 active:scale-95 transition-all duration-200"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
              )}
            </button>

            {/* User / Auth Avatar */}
            {user ? (
              <button
                type="button"
                onClick={onOpenAccount}
                className="flex items-center gap-1.5 p-1 sm:pr-3 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
                title={user.email || 'Account'}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-xs font-extrabold shadow-sm overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.displayName?.[0] || user.email?.[0] || 'U'
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline max-w-[90px] truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-glow-blue active:scale-95 transition-all duration-200"
                title={t.signIn}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.signIn}</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating Glassmorphic Nav Tabs */}
        <nav className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-200/50 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-inner">
          <button
            onClick={() => onTabChange('calc')}
            type="button"
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === 'calc'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>{t.tabCalculator}</span>
          </button>

          <button
            onClick={() => onTabChange('history')}
            type="button"
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t.tabHistory}</span>
          </button>

          <button
            onClick={() => onTabChange('backup')}
            type="button"
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === 'backup'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 scale-[1.02]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`}
          >
            <CloudDownload className="w-4 h-4" />
            <span>{t.tabBackup}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
