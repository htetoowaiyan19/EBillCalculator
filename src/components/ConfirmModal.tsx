import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  lang: Language;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  lang,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 w-full max-w-sm rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 font-burmese">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 shadow-inner">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
              {t.confirmModalTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition"
          >
            {t.confirmBtnNo}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 shadow-md shadow-rose-500/25 transition"
          >
            {t.confirmBtnYes}
          </button>
        </div>
      </div>
    </div>
  );
};
