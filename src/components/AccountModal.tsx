import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-burmese no-print">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative z-10 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 w-full max-w-sm rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5"
          >
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

            {/* Profile Info */}
            <div className="flex flex-col items-center text-center p-4 bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl font-black flex items-center justify-center shadow-md mb-2.5 overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.displayName?.[0] || user.email?.[0] || 'U'
                )}
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {user.displayName || user.email?.split('@')[0]}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium break-all">
                {user.email}
              </p>
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{t.cloudSync}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onSyncLocalToCloud}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 shadow-sm transition"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{t.syncLocalToCloud}</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-extrabold text-rose-600 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-900/60 shadow-sm transition"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logOut}</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
