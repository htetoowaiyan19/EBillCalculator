import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { motion } from 'framer-motion';
import {
  Zap,
  Home,
  Globe,
  Sun,
  Moon,
  Copy,
  Check,
  LogIn,
  LogOut,
  Users,
} from 'lucide-react';
import { Language, Theme } from '../../types';
import { ManagerRole } from '../../types/housePlanTypes';
import { translations } from '../../constants/translations';
import { housePlanTranslations } from '../../constants/housePlanTranslations';

interface UnifiedHeaderProps {
  currentRoute: '/ebillcalculator' | '/houseplan';
  lang: Language;
  theme: Theme;
  user: User | null;
  // HousePlan-specific metadata (optional)
  housePlanData?: {
    managerName: string;
    managerId: string;
    userRole: ManagerRole;
    onOpenMembersModal?: () => void;
    onSwitchManager?: () => void;
  } | null;
  onNavigateRoute?: (route: '/ebillcalculator' | '/houseplan') => void;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  currentRoute,
  lang,
  theme,
  user,
  housePlanData,
  onToggleLang,
  onToggleTheme,
  onOpenAuth,
  onOpenAccount,
}) => {
  const isEbill = currentRoute === '/ebillcalculator';
  const tEbill = translations[lang];
  const tHouse = housePlanTranslations[lang];

  const [copied, setCopied] = useState(false);

  const handleCopyManagerId = () => {
    if (housePlanData?.managerId) {
      navigator.clipboard.writeText(housePlanData.managerId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300 no-print">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Branding & Active Miniapp Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative group shrink-0">
            <div
              className={`absolute -inset-0.5 rounded-xl blur opacity-40 group-hover:opacity-75 transition ${
                isEbill
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600'
              }`}
            />
            <div
              className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-white flex items-center justify-center shadow-md ${
                isEbill
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-tr from-amber-500 to-orange-600'
              }`}
            >
              {isEbill ? (
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current animate-pulse" />
              ) : (
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-xs sm:text-sm md:text-base font-black text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-[220px] md:max-w-[300px]">
                {isEbill
                  ? tEbill.appTitle
                  : housePlanData?.managerName || tHouse.appTitle}
              </h1>

              {/* If on HousePlan and manager is active: show Manager ID badge and Role */}
              {!isEbill && housePlanData && (
                <>
                  <button
                    type="button"
                    onClick={handleCopyManagerId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 active:scale-95 transition"
                    title="Copy 8-Digit Manager ID"
                  >
                    <span>ID: {housePlanData.managerId}</span>
                    {copied ? (
                      <Check className="w-2.5 h-2.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-2.5 h-2.5" />
                    )}
                  </button>
                  <span
                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md hidden xs:inline-block ${
                      housePlanData.userRole === 'admin'
                        ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                        : housePlanData.userRole === 'editor'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {housePlanData.userRole}
                  </span>
                </>
              )}
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:block truncate">
              {isEbill ? tEbill.appSubtitle : tHouse.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Controls & Global Actions - ALL BUTTONS EQUAL HEIGHT (h-8 sm:h-9) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* If on HousePlan: Members & Permissions button */}
          {!isEbill && housePlanData?.onOpenMembersModal && (
            <motion.button
              whileTap={{ scale: 0.93 }}
              type="button"
              onClick={housePlanData.onOpenMembersModal}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-amber-600 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 transition shadow-sm"
              title={tHouse.manageMembersBtn}
            >
              <Users className="w-3.5 h-3.5" />
            </motion.button>
          )}

          {/* If on HousePlan: Switch Manager button */}
          {!isEbill && housePlanData?.onSwitchManager && (
            <motion.button
              whileTap={{ scale: 0.93 }}
              type="button"
              onClick={housePlanData.onSwitchManager}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-amber-600 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 transition shadow-sm"
              title={tHouse.switchManager}
            >
              <LogOut className="w-3.5 h-3.5" />
            </motion.button>
          )}

          {/* Language Switch - h-8 sm:h-9 */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onToggleLang}
            type="button"
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full flex items-center justify-center gap-1 text-[11px] font-bold bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 transition shadow-sm"
            title="Toggle Language"
          >
            <Globe className="w-3 h-3 text-blue-500" />
            <span>{lang === 'MY' ? 'EN' : 'မြန်မာ'}</span>
          </motion.button>

          {/* Theme Switch - h-8 sm:h-9 */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onToggleTheme}
            type="button"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 transition shadow-sm"
            title="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-700 fill-slate-700" />
            )}
          </motion.button>

          {/* User Profile / Auth Button - h-8 sm:h-9 */}
          {user ? (
            <motion.button
              whileTap={{ scale: 0.93 }}
              type="button"
              onClick={onOpenAccount}
              className="h-8 sm:h-9 flex items-center gap-1.5 pl-1 pr-2 sm:pr-2.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 transition shadow-sm"
              title={user.email || 'Account'}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-[11px] font-extrabold overflow-hidden shrink-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.displayName?.[0] || user.email?.[0] || 'U'
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 hidden md:inline max-w-[80px] truncate">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.93 }}
              type="button"
              onClick={onOpenAuth}
              className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-full flex items-center gap-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
            >
              <LogIn className="w-3 h-3" />
              <span>{tEbill.signIn}</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};
