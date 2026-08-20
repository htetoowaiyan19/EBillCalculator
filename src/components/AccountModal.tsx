import React from 'react';
import { X, LogOut, Cloud, UploadCloud } from 'lucide-react';
import { User } from 'firebase/auth';
import { Language } from '../types';
import { translations } from '../constants/translations';
import { logoutUser } from '../services/firebase';

interface AccountModalProps {
  isOpen: boolean;
  user: User | null;
  lang: Language;
  onClose: () => void;
  onSyncLocalToCloud: () => void;
  onSuccess: (msg: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  user,
  lang,
  onClose,
  onSyncLocalToCloud,
  onSuccess,
}) => {
  if (!isOpen || !user) return null;
  const t = translations[lang];

  const handleLogout = async () => {
    try {
      await logoutUser();
      onSuccess(`✅ ${t.signedOutSuccess}`);
      onClose();
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 w-full max-w-sm rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200 font-burmese">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
            <span>{t.account}</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="text-center py-2 space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black uppercase">
                {user.displayName?.[0] || user.email?.[0] || 'U'}
              </span>
            )}
          </div>

          <div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              {user.displayName || user.email?.split('@')[0]}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {user.email}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.cloudSync}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onSyncLocalToCloud}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 shadow-sm active:scale-[0.98] transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t.syncLocalToCloud}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 shadow-sm active:scale-[0.98] transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logOut}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
