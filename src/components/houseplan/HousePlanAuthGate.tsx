import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LogIn,
  PlusCircle,
  KeyRound,
  History,
  Lock,
  ArrowRight,
  Building,
  X,
  Trash2,
  ShieldCheck,
  FolderKanban,
} from 'lucide-react';
import { Language } from '../../types';
import { housePlanTranslations } from '../../constants/housePlanTranslations';
import {
  createHouseManagerInFirestore,
  joinHouseManagerInFirestore,
  clearHousePlanLocalStorage,
  fetchUserManagedProjects,
} from '../../services/housePlanFirebase';
import { HouseManagerDocument } from '../../types/housePlanTypes';
import { ConfirmModal } from '../ConfirmModal';

interface HousePlanAuthGateProps {
  user: User | null;
  lang: Language;
  recentManagerIds: string[];
  onOpenAuth: () => void;
  onManagerLoaded: (managerId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'warning') => void;
  onClearLocalStorage?: () => void;
}

export const HousePlanAuthGate: React.FC<HousePlanAuthGateProps> = ({
  user,
  lang,
  recentManagerIds,
  onOpenAuth,
  onManagerLoaded,
  onShowToast,
  onClearLocalStorage,
}) => {
  const t = housePlanTranslations[lang];

  // Modals inside AuthGate
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isClearLocalModalOpen, setIsClearLocalModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Admin Managed Projects (Quick Access)
  const [adminProjects, setAdminProjects] = useState<HouseManagerDocument[]>([]);
  const [loadingAdminProjects, setLoadingAdminProjects] = useState(false);

  useEffect(() => {
    if (!user) {
      setAdminProjects([]);
      return;
    }
    let isMounted = true;
    setLoadingAdminProjects(true);
    fetchUserManagedProjects(user)
      .then((projects) => {
        if (isMounted) {
          setAdminProjects(projects);
          setLoadingAdminProjects(false);
        }
      })
      .catch((err) => {
        console.warn(err);
        if (isMounted) setLoadingAdminProjects(false);
      });
    return () => {
      isMounted = false;
    };
  }, [user]);

  // Create Form State
  const [createForm, setCreateForm] = useState({
    name: '',
    location: '',
    password: '',
    startDate: '',
    targetCompletionDate: '',
  });

  // Join Form State
  const [joinForm, setJoinForm] = useState({
    managerId: '',
    password: '',
  });

  // Handle Create Manager
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!createForm.name.trim() || !createForm.password.trim()) {
      setErrorMsg(t.errFillManagerFields);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const created = await createHouseManagerInFirestore(user, createForm);
      onShowToast(
        lang === 'MY'
          ? `စီမံခန့်ခွဲမှု အောင်မြင်စွာ ဖွင့်ပြီးပါပြီ (ID: ${created.managerId})`
          : `House Manager created successfully (ID: ${created.managerId})`,
        'success'
      );
      setIsCreateModalOpen(false);
      onManagerLoaded(created.managerId);
    } catch (err) {
      console.error(err);
      setErrorMsg(lang === 'MY' ? 'ဖန်တီးမှု မအောင်မြင်ပါ' : 'Failed to create manager');
    } finally {
      setLoading(false);
    }
  };

  // Handle Join Manager
  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!joinForm.managerId.trim() || !joinForm.password.trim()) {
      setErrorMsg(t.errFillManagerFields);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const manager = await joinHouseManagerInFirestore(
        user,
        joinForm.managerId,
        joinForm.password
      );
      onShowToast(
        lang === 'MY'
          ? `စီမံခန့်ခွဲမှုသို့ ဝင်ရောက်ပြီးပါပြီ (${manager.name})`
          : `Joined manager successfully (${manager.name})`,
        'success'
      );
      setIsJoinModalOpen(false);
      onManagerLoaded(manager.managerId);
    } catch (err: any) {
      console.error(err);
      if (err?.message === 'MANAGER_NOT_FOUND') {
        setErrorMsg(t.errManagerNotFound);
      } else if (err?.message === 'INVALID_PASSWORD') {
        setErrorMsg(t.errInvalidPassword);
      } else {
        setErrorMsg(lang === 'MY' ? 'ချိတ်ဆက်မှု မအောင်မြင်ပါ' : 'Failed to join manager');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Clear Local Storage with Custom Confirm Modal
  const handleClearLocalStorage = () => {
    setIsClearLocalModalOpen(true);
  };

  const handleConfirmClearLocalStorage = () => {
    clearHousePlanLocalStorage();
    setIsClearLocalModalOpen(false);
    onClearLocalStorage?.();
    onShowToast(t.clearLocalStorageSuccess, 'success');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 sm:py-12 relative z-10 animate-in fade-in duration-300">
      {/* Top Banner Branding */}
      <div className="text-center mb-8">
        <div className="inline-flex relative group mb-4">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl blur opacity-50 group-hover:opacity-80 transition duration-300"></div>
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xl">
            <Home className="w-8 h-8" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
          {t.authRequiredTitle}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          {t.authRequiredDesc}
        </p>
      </div>

      {/* Case 1: User is NOT Logged In */}
      {!user ? (
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              {lang === 'MY' ? 'အကောင့်ဝင်ရောက်ရန် လိုအပ်ပါသည်' : 'Authentication Required'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'MY'
                ? 'Google သို့မဟုတ် Email ဖြင့် အခမဲ့ လွယ်ကူစွာ အကောင့်ဝင်ရောက်နိုင်ပါသည်'
                : 'Sign in with Google or Email to create or access shared house managers'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenAuth}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-95 shadow-lg shadow-amber-500/25 transition duration-200"
          >
            <LogIn className="w-4 h-4" />
            <span>{t.signInBtn}</span>
          </button>
        </div>
      ) : (
        /* Case 2: User IS Logged In -> Choose or Join Manager */
        <div className="space-y-4">
          <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-5 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark mb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{lang === 'MY' ? 'လက်ရှိ အကောင့်' : 'Signed in as'}:</span>
              <strong className="text-slate-900 dark:text-slate-100 font-bold truncate max-w-[180px]">
                {user.displayName || user.email}
              </strong>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 gap-3.5">
            {/* Card 1: Create New Manager */}
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setIsCreateModalOpen(true);
              }}
              className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:from-amber-500/15 hover:to-orange-500/15 border border-amber-300/60 dark:border-amber-700/60 text-left transition active:scale-[0.98] shadow-sm group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25 group-hover:scale-105 transition">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {t.createManagerCardTitle}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t.createManagerCardDesc}
                  </p>
                </div>
              </div>
            </button>

            {/* Card 2: Join Manager with 8-Digit ID & Password */}
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setIsJoinModalOpen(true);
              }}
              className="p-5 rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 hover:from-blue-500/15 hover:to-indigo-500/15 border border-blue-300/60 dark:border-blue-700/60 text-left transition active:scale-[0.98] shadow-sm group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-105 transition">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {t.joinManagerCardTitle}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {t.joinManagerCardDesc}
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Admin Managed Projects Section (1-Tap Quick Access) */}
          {user && (loadingAdminProjects || adminProjects.length > 0) && (
            <div className="pt-4">
              <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-800 dark:text-slate-200 font-extrabold">
                    {t.adminProjectsTitle}
                  </span>
                </div>
                {!loadingAdminProjects && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black border border-amber-500/20">
                    {adminProjects.length}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5 leading-relaxed">
                {t.adminProjectsDesc}
              </p>

              {loadingAdminProjects ? (
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-300/30 flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <div className="w-3.5 h-3.5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  <span>{lang === 'MY' ? 'စီမံကိန်းများ ရှာဖွေနေပါသည်...' : 'Loading your managed projects...'}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {adminProjects.map((proj) => (
                    <button
                      key={proj.managerId}
                      type="button"
                      onClick={() => onManagerLoaded(proj.managerId)}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-transparent hover:from-amber-500/15 hover:via-orange-500/10 hover:to-amber-500/5 border border-amber-300/70 dark:border-amber-700/70 text-xs font-bold text-slate-800 dark:text-slate-200 active:scale-[0.98] transition group shadow-sm text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
                          <FolderKanban className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                            {proj.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              ID: {proj.managerId}
                            </span>
                            {proj.location && (
                              <span className="truncate max-w-[120px] text-slate-400 font-sans">
                                • {proj.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-white text-[11px] font-black shadow-md shadow-amber-500/20 group-hover:bg-amber-600 transition">
                        <span>{t.quickOpenBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Managers Section */}
          {recentManagerIds.length > 0 && (
            <div className="pt-4">
              <div className="flex items-center justify-between gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                <div className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.recentManagersTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearLocalStorage}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline transition"
                  title={t.clearLocalStorage}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t.clearLocalStorage}</span>
                </button>
              </div>
              <div className="space-y-2">
                {recentManagerIds.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onManagerLoaded(id)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-amber-500/60 active:scale-95 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-mono font-black text-[11px]">
                        ID
                      </span>
                      <span className="font-mono text-sm tracking-wider font-extrabold">{id}</span>
                    </div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      {lang === 'MY' ? 'ပြန်လည်ဖွင့်မည်' : 'Open'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear local storage option if no recent managers */}
          {recentManagerIds.length === 0 && (
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={handleClearLocalStorage}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>{t.clearLocalStorage}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Manager with Framer Motion Animations */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-amber-500" />
                  {t.modalCreateManagerTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.inputManagerName} *
                  </label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="ဥပမာ - ဦးမင်း မိသားစု ၂ ထပ် RC နေအိမ်"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.locationLabel}
                  </label>
                  <input
                    type="text"
                    value={createForm.location}
                    onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                    placeholder="ဥပမာ - မင်္ဂလာဒုံ၊ ရန်ကုန်"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>{t.inputManagerPassword} *</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {lang === 'MY' ? 'အဖွဲ့ဝင်များ မျှဝေရန်' : 'Share with team'}
                    </span>
                  </label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder={t.inputManagerPasswordPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {t.startDateLabel}
                    </label>
                    <input
                      type="date"
                      value={createForm.startDate}
                      onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                      {t.targetDateLabel}
                    </label>
                    <input
                      type="date"
                      value={createForm.targetCompletionDate}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, targetCompletionDate: e.target.value })
                      }
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition disabled:opacity-50"
                  >
                    {loading ? '...' : t.btnCreateManager}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Join Manager with Framer Motion Animations */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-blue-500" />
                  {t.modalJoinManagerTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleJoinSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.inputManagerId} *
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    value={joinForm.managerId}
                    onChange={(e) => setJoinForm({ ...joinForm, managerId: e.target.value.replace(/\D/g, '') })}
                    placeholder={t.inputManagerIdPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-base font-mono tracking-widest text-center focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.inputManagerPassword} *
                  </label>
                  <input
                    type="password"
                    value={joinForm.password}
                    onChange={(e) => setJoinForm({ ...joinForm, password: e.target.value })}
                    placeholder={t.inputManagerPasswordPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsJoinModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition disabled:opacity-50"
                  >
                    {loading ? '...' : t.btnJoinManager}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Modal for Local Storage Clearing */}
      <ConfirmModal
        isOpen={isClearLocalModalOpen}
        message={t.confirmClearLocalStorageDesc}
        lang={lang}
        onConfirm={handleConfirmClearLocalStorage}
        onCancel={() => setIsClearLocalModalOpen(false)}
      />
    </div>
  );
};
