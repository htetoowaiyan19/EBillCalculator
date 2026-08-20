import React, { useRef } from 'react';
import { Download, Upload, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../constants/translations';

interface BackupSectionProps {
  lang: Language;
  onDownloadBackup: () => void;
  onRestoreBackup: (file: File) => void;
}

export const BackupSection: React.FC<BackupSectionProps> = ({
  lang,
  onDownloadBackup,
  onRestoreBackup,
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onRestoreBackup(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-white/60 dark:border-slate-800/80 p-6 sm:p-7 shadow-glass dark:shadow-glass-dark space-y-5 animate-in fade-in duration-200 relative overflow-hidden">
      {/* Accent corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-2xl pointer-events-none"></div>

      {/* Title */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100/80 dark:border-slate-800/80 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
          {t.backupTitle}
        </h2>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium relative z-10">
        {t.backupDesc}
      </p>

      <div className="space-y-4 pt-2 relative z-10">
        {/* Download Backup Button */}
        <button
          type="button"
          onClick={onDownloadBackup}
          className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-2xl font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-lg shadow-blue-500/25 transition-all text-sm sm:text-base group"
        >
          <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition duration-200" />
          <span>{t.btnDownloadBackup}</span>
        </button>

        <div className="relative py-2 flex items-center justify-center">
          <div className="border-t border-slate-200/80 dark:border-slate-800 w-full"></div>
          <span className="bg-white/90 dark:bg-slate-900/90 px-3 text-[11px] text-slate-400 uppercase font-black tracking-widest absolute rounded-full border border-slate-200/50 dark:border-slate-800">
            {lang === 'MY' ? 'သို့မဟုတ်' : 'OR'}
          </span>
        </div>

        {/* Restore Backup Area */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 space-y-2.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {t.lblRestoreFile}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="w-full text-xs font-medium file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-blue-50 file:text-blue-600 dark:file:bg-blue-950/60 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 shadow-sm"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-extrabold text-emerald-600 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-[0.98] transition text-xs sm:text-sm shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>{t.btnRestoreBackup}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
