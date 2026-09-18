import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Upload,
  Database,
  Users,
  LogOut,
  Trash2,
  AlertTriangle,
  X,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { Language } from '../../types';
import {
  HouseManagerDocument,
  HousePlanBackup,
  ManagerRole,
} from '../../types/housePlanTypes';
import { housePlanTranslations } from '../../constants/housePlanTranslations';
import { ConfirmModal } from '../ConfirmModal';

interface HousePlanDataSectionProps {
  manager: HouseManagerDocument;
  lang: Language;
  userRole: ManagerRole;
  onRestoreManager: (restored: HouseManagerDocument) => void;
  onOpenMembersModal: () => void;
  onSwitchManager: () => void;
  onDeleteManager: (managerId: string) => Promise<void>;
  onClearLocalStorage: () => void;
  onShowToast: (message: string, type?: 'success' | 'warning') => void;
}

export const HousePlanDataSection: React.FC<HousePlanDataSectionProps> = ({
  manager,
  lang,
  userRole,
  onRestoreManager,
  onOpenMembersModal,
  onSwitchManager,
  onDeleteManager,
  onClearLocalStorage,
  onShowToast,
}) => {
  const t = housePlanTranslations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Manager Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClearLocalModalOpen, setIsClearLocalModalOpen] = useState(false);
  const [typedManagerId, setTypedManagerId] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = userRole === 'admin';
  const isMatch = typedManagerId.trim() === manager.managerId;

  const handleDownload = () => {
    const backup: HousePlanBackup = {
      appName: 'HousePlanBudget',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      manager,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date();
    const dateStr = `${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}_${String(d.getDate()).padStart(2, '0')}`;
    a.href = url;
    a.download = `houseplan_${manager.managerId}_backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onShowToast(lang === 'MY' ? 'ဒေတာဖိုင် သိမ်းဆည်းပြီးပါပြီ' : 'Backup downloaded successfully', 'success');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed?.manager && Array.isArray(parsed.manager.expenses)) {
        onRestoreManager(parsed.manager);
        onShowToast(t.restoreSuccess, 'success');
      } else {
        throw new Error('Invalid schema');
      }
    } catch (err) {
      console.error(err);
      onShowToast(t.restoreInvalid, 'warning');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmClearLocalStorage = () => {
    setIsClearLocalModalOpen(true);
  };

  const handleExecuteClearLocalStorage = () => {
    onClearLocalStorage();
    setIsClearLocalModalOpen(false);
    onShowToast(t.clearLocalStorageSuccess, 'success');
  };

  const handleExecuteDeleteManager = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !isMatch || isDeleting) return;

    setIsDeleting(true);
    try {
      await onDeleteManager(manager.managerId);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      onShowToast(lang === 'MY' ? 'ဖျက်သိမ်းမှု မအောင်မြင်ပါ' : 'Failed to delete manager from server', 'warning');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Main Data & Management Section */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-6 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark">
        <div className="pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-500" />
            {t.dataSettingsTitle}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.dataSettingsDesc}</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Card 1: Team & Permissions */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                {t.membersTitle}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                {t.membersDesc} (Manager ID: <span className="font-mono font-bold text-amber-600">{manager.managerId}</span>)
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenMembersModal}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 active:scale-95 border border-amber-500/30 transition"
            >
              {t.manageMembersBtn}
            </button>
          </div>

          {/* Card 2: Switch / Exit Manager */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2.5">
                <LogOut className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                {t.switchManager}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                {lang === 'MY'
                  ? 'အခြားအိမ်ဆောက် စီမံခန့်ခွဲမှု စာရင်းတစ်ခုသို့ ပြောင်းလဲဖွင့်လှစ်မည် (သို့) အသစ်ဖန်တီးမည်။'
                  : 'Open another house manager using an 8-digit ID or create a new project.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onSwitchManager}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 active:scale-95 transition"
            >
              {t.switchManager}
            </button>
          </div>

          {/* Card 3: Download Backup */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                {t.btnDownloadBackup}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                {lang === 'MY'
                  ? 'အသုံးစရိတ်နှင့် စီမံကိန်း အချက်အလက်များအား JSON ဖိုင်အဖြစ် ဒေါင်းလုဒ်ဆွဲထားမည်။'
                  : 'Save all your project expenses and milestones as a secure offline JSON file.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition shadow-sm"
            >
              {t.btnDownloadBackup}
            </button>
          </div>

          {/* Card 4: Restore Backup */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                <Upload className="w-5 h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                {t.btnRestoreBackup}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                {lang === 'MY'
                  ? 'ယခင်က သိမ်းဆည်းထားသော Backup JSON ဖိုင်ကို ပြန်လည်သွင်းယူမည်။'
                  : 'Import a previously saved JSON backup file to restore records.'}
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 border border-emerald-500/30 transition"
            >
              {t.btnRestoreBackup}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone & Local Storage Management */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-6 border border-rose-200/60 dark:border-rose-900/40 shadow-glass dark:shadow-glass-dark">
        <div className="pb-3 mb-4 border-b border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {t.dangerZoneTitle}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.dangerZoneDesc}</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            DANGER
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Card: Clear Local Storage */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2.5">
                <Trash2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                {t.clearLocalStorage}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                {t.clearLocalStorageDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={handleConfirmClearLocalStorage}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-slate-700/80 hover:bg-rose-500/15 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 active:scale-95 border border-transparent transition"
            >
              {t.clearLocalStorage}
            </button>
          </div>

          {/* Card: Delete Manager from Server (Admin Only) */}
          {isAdmin ? (
            <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {t.deleteManagerAdminOnlyBadge}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-rose-700 dark:text-rose-300 mb-1">
                  {t.deleteManagerBtn}
                </h3>
                <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80 mb-3 leading-relaxed">
                  {lang === 'MY'
                    ? 'ဤစီမံခန့်ခွဲမှုစာရင်း (ID: ' + manager.managerId + ') နှင့်တကွ အသုံးစရိတ်စာရင်းများအားလုံးကို Server မှ လုံးဝ အပြီးတိုင် ဖျက်ပစ်မည်။'
                    : `Permanently remove manager (${manager.managerId}) and all attached records from the server.`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTypedManagerId('');
                  setIsDeleteModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 shadow-md shadow-rose-500/25 transition"
              >
                {t.deleteManagerBtn}
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/60 flex flex-col justify-between opacity-70">
              <div>
                <div className="w-9 h-9 rounded-xl bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 flex items-center justify-center mb-2.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  {t.deleteManagerBtn}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-3 leading-relaxed">
                  {lang === 'MY'
                    ? 'စီမံခန့်ခွဲသူ Admin သာလျှင် Server မှ အပြီးတိုင် ဖျက်ခွင့်ရှိပါသည်။'
                    : 'Only project Admin has permission to delete this manager from the server.'}
                </p>
              </div>
              <button
                type="button"
                disabled
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
              >
                {t.deleteManagerAdminOnlyBadge}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Manager Permanent Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-rose-300 dark:border-rose-900 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100 dark:border-rose-900/50">
                <h3 className="text-base font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {t.modalDeleteManagerTitle}
                </h3>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs leading-relaxed mb-4">
                {t.deleteManagerWarningText}
              </div>

              <form onSubmit={handleExecuteDeleteManager} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {t.typeManagerIdToConfirm.replace('{id}', manager.managerId)}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={8}
                      value={typedManagerId}
                      onChange={(e) => setTypedManagerId(e.target.value.replace(/\D/g, ''))}
                      placeholder={manager.managerId}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-mono font-black text-lg tracking-widest focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white selection:bg-rose-500"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 text-center font-mono">
                    {isMatch ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        ✓ ID matches! You may now permanently delete.
                      </span>
                    ) : (
                      <span>
                        Target Manager ID: <strong className="text-slate-700 dark:text-slate-300">{manager.managerId}</strong>
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={!isMatch || isDeleting}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 hover:from-rose-700 hover:to-red-800 active:scale-95 shadow-md shadow-rose-500/30 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{t.deleteManagerLoading}</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.confirmDeleteManagerBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Modal for Clearing Local Storage */}
      <ConfirmModal
        isOpen={isClearLocalModalOpen}
        message={t.confirmClearLocalStorageDesc}
        lang={lang}
        onConfirm={handleExecuteClearLocalStorage}
        onCancel={() => setIsClearLocalModalOpen(false)}
      />
    </div>
  );
};
