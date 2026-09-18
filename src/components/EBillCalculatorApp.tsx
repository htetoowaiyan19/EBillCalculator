import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../services/firebase';
import { UnifiedHeader } from './navigation/UnifiedHeader';
import { BottomNavBar } from './navigation/BottomNavBar';
import { StepCurrent } from './StepCurrent';
import { StepPrevious } from './StepPrevious';
import { StepTotal } from './StepTotal';
import { ResultsCard } from './ResultsCard';
import { ReceiptModal } from './ReceiptModal';
import { VersionUpdateModal, CURRENT_VERSION } from './VersionUpdateModal';
import { HistorySection } from './HistorySection';
import { BackupSection } from './BackupSection';
import { ConfirmModal } from './ConfirmModal';
import { AuthModal } from './AuthModal';
import { AccountModal } from './AccountModal';
import { Toast } from './Toast';
import { ActiveTab, CalculationRecord, CustomNames, Language, MeterInputs, Theme } from '../types';
import { translations } from '../constants/translations';
import { calculateBill, generateViberText } from '../utils/calculation';
import {
  getStoredHistory,
  getStoredNames,
  getStoredPrevious,
  saveHistoryRecord,
  deleteHistoryRecord,
  clearAllHistory,
  setStoredNames,
  setStoredPrevious,
  exportBackupJson,
  importBackupJson,
  clearEBillLocalStorage,
} from '../utils/storage';
import {
  saveHistoryToCloud,
  fetchHistoryFromCloud,
  deleteHistoryFromCloud,
  savePreviousToCloud,
  fetchPreviousFromCloud,
} from '../services/firebase';
import { RotateCcw, Zap, Sparkles } from 'lucide-react';

interface EBillCalculatorAppProps {
  lang: Language;
  theme: Theme;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onNavigateRoute: (route: '/ebillcalculator' | '/houseplan') => void;
}

export const EBillCalculatorApp: React.FC<EBillCalculatorAppProps> = ({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  onNavigateRoute,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calc');

  // Auto-save to history preference
  const [autoSave, setAutoSave] = useState<boolean>(() => localStorage.getItem('ebill_autosave') !== 'false');

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(() => {
    return localStorage.getItem('ebill_last_seen_version') !== CURRENT_VERSION;
  });

  // Custom Names
  const [names, setNames] = useState<CustomNames>(() => getStoredNames());

  // Meter Inputs
  const [inputs, setInputs] = useState<MeterInputs>(() => {
    const savedPrev = getStoredPrevious();
    return {
      p1Current: '',
      p2Current: '',
      sharedCurrent: '',
      p1Prev: savedPrev?.p1 !== undefined ? String(savedPrev.p1) : '',
      p2Prev: savedPrev?.p2 !== undefined ? String(savedPrev.p2) : '',
      sharedPrev: savedPrev?.shared !== undefined ? String(savedPrev.shared) : '',
      totalBill: '',
      sharedUsers: '',
    };
  });

  // Current Calculation Result
  const [currentCalc, setCurrentCalc] = useState<CalculationRecord | null>(null);

  // History List
  const [history, setHistory] = useState<CalculationRecord[]>(() => getStoredHistory());

  // Feedback States
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'warning' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Logged-in: load history and previous readings from Cloud Firestore
        try {
          const cloudHistory = await fetchHistoryFromCloud(currentUser);
          setHistory(cloudHistory);
        } catch {
          // Cloud fetch fallback to local
          setHistory(getStoredHistory());
        }

        try {
          const cloudPrev = await fetchPreviousFromCloud(currentUser);
          if (cloudPrev) {
            setInputs((prev) => ({
              ...prev,
              p1Prev: cloudPrev.p1 !== undefined ? String(cloudPrev.p1) : prev.p1Prev,
              p2Prev: cloudPrev.p2 !== undefined ? String(cloudPrev.p2) : prev.p2Prev,
              sharedPrev: cloudPrev.shared !== undefined ? String(cloudPrev.shared) : prev.sharedPrev,
            }));
          }
        } catch {
          // Keep local inputs
        }
      } else {
        // Logged out: fallback to local storage
        setHistory(getStoredHistory());
      }
    });

    return () => unsubscribe();
  }, []);

  // Show Toast Message Helper
  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  // Close Version Update Modal
  const handleCloseVersionModal = () => {
    setIsVersionOpen(false);
    localStorage.setItem('ebill_last_seen_version', CURRENT_VERSION);
  };

  // Handle Input Changes
  const handleInputChange = (field: keyof MeterInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Custom Name Changes
  const handleNameChange = (field: keyof CustomNames, value: string) => {
    const updated = { ...names, [field]: value };
    setNames(updated);
    setStoredNames(updated);
  };

  // Quick fill previous month from stored records
  const handleFillPrevious = () => {
    const prev = getStoredPrevious();
    if (prev && (prev.p1 !== undefined || prev.p2 !== undefined || prev.shared !== undefined)) {
      setInputs((current) => ({
        ...current,
        p1Prev: prev.p1 !== undefined ? String(prev.p1) : current.p1Prev,
        p2Prev: prev.p2 !== undefined ? String(prev.p2) : current.p2Prev,
        sharedPrev: prev.shared !== undefined ? String(prev.shared) : current.sharedPrev,
      }));
      showToast(t.fillPreviousSuccess);
    } else {
      showToast(t.fillPreviousEmpty, 'warning');
    }
  };

  // Main Calculation Action
  const handleCalculate = async () => {
    const p1C = parseFloat(inputs.p1Current);
    const p2C = parseFloat(inputs.p2Current);
    const sC = parseFloat(inputs.sharedCurrent);
    const p1P = parseFloat(inputs.p1Prev);
    const p2P = parseFloat(inputs.p2Prev);
    const sP = parseFloat(inputs.sharedPrev);
    const total = parseFloat(inputs.totalBill);
    const users = parseInt(inputs.sharedUsers, 10);

    if (
      isNaN(p1C) ||
      isNaN(p2C) ||
      isNaN(sC) ||
      isNaN(p1P) ||
      isNaN(p2P) ||
      isNaN(sP) ||
      isNaN(total) ||
      isNaN(users) ||
      users <= 0
    ) {
      showToast(t.errFillAll, 'warning');
      return;
    }

    if (total <= 0) {
      showToast(t.errZeroBill, 'warning');
      return;
    }

    const result = calculateBill(inputs, names, lang);
    if (!result.success) {
      showToast(t[result.errorKey], 'warning');
      return;
    }

    const calcResult = result.data;
    setCurrentCalc(calcResult);

    // Auto-save to history
    if (autoSave) {
      if (user) {
        try {
          await saveHistoryToCloud(user, calcResult);
          setHistory((prev) => [calcResult, ...prev.filter((item) => item.id !== calcResult.id)]);
        } catch {
          const updated = saveHistoryRecord(calcResult);
          setHistory(updated);
        }
      } else {
        const updated = saveHistoryRecord(calcResult);
        setHistory(updated);
      }

      const newPrevious = {
        p1: calcResult.p1Current,
        p2: calcResult.p2Current,
        shared: calcResult.sharedCurrent,
      };
      setStoredPrevious(newPrevious);

      if (user) {
        try {
          await savePreviousToCloud(user, newPrevious);
        } catch {
          // Fallback to local
        }
      }
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // Reset form
  const handleClear = () => {
    setInputs({
      p1Current: '',
      p2Current: '',
      sharedCurrent: '',
      p1Prev: '',
      p2Prev: '',
      sharedPrev: '',
      totalBill: '',
      sharedUsers: '',
    });
    setCurrentCalc(null);
  };

  // Copy Viber text to clipboard
  const handleCopyViber = () => {
    if (!currentCalc) return;
    const text = generateViberText(currentCalc, lang);
    navigator.clipboard.writeText(text);
    showToast(t.copiedToast);
  };

  // Load past record into calculator
  const handleLoadRecord = (record: CalculationRecord) => {
    setInputs({
      p1Current: String(record.p1Current),
      p2Current: String(record.p2Current),
      sharedCurrent: String(record.sharedCurrent),
      p1Prev: String(record.p1Prev),
      p2Prev: String(record.p2Prev),
      sharedPrev: String(record.sharedPrev),
      totalBill: String(record.totalBill),
      sharedUsers: String(record.sharedUsers),
    });
    setNames({
      p1: record.p1Name,
      p2: record.p2Name,
      shared: record.sharedName,
    });
    setCurrentCalc(record);
    setActiveTab('calc');
    showToast(t.loadedToCalcSuccess);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete single history item
  const handleDeleteRecord = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: t.confirmDelete,
      onConfirm: async () => {
        if (user) {
          try {
            await deleteHistoryFromCloud(id);
            setHistory((prev) => prev.filter((item) => item.id !== id));
          } catch {
            const updated = deleteHistoryRecord(id);
            setHistory(updated);
          }
        } else {
          const updated = deleteHistoryRecord(id);
          setHistory(updated);
        }
        setConfirmModal(null);
      },
    });
  };

  // Clear all history
  const handleClearAllHistory = () => {
    setConfirmModal({
      isOpen: true,
      message: t.confirmDeleteAll,
      onConfirm: async () => {
        clearAllHistory();
        setHistory([]);
        setConfirmModal(null);
      },
    });
  };

  // Backup & Restore
  const handleDownloadBackup = () => {
    exportBackupJson();
    showToast('Backup downloaded successfully');
  };

  const handleRestoreBackup = async (file: File) => {
    try {
      const text = await file.text();
      const res = importBackupJson(text);
      if (!res.success) {
        showToast(t.restoreInvalid, 'warning');
        return;
      }
      const restored = res.data;
      setHistory(restored.history || []);
      setNames(restored.names || { p1: '', p2: '', shared: '' });
      if (restored.previous) {
        setInputs((prev) => ({
          ...prev,
          p1Prev: restored.previous?.p1 !== undefined ? String(restored.previous.p1) : prev.p1Prev,
          p2Prev: restored.previous?.p2 !== undefined ? String(restored.previous.p2) : prev.p2Prev,
          sharedPrev: restored.previous?.shared !== undefined ? String(restored.previous.shared) : prev.sharedPrev,
        }));
      }
      showToast(t.restoreSuccess);
    } catch {
      showToast(t.restoreInvalid, 'warning');
    }
  };

  // Clear Local Storage Data with Custom Animated ConfirmModal
  const handleClearLocalStorage = () => {
    setConfirmModal({
      isOpen: true,
      message: t.confirmClearEbillStorage,
      onConfirm: () => {
        clearEBillLocalStorage();
        setNames({ p1: '', p2: '', shared: '' });
        setHistory([]);
        setInputs({
          p1Current: '',
          p2Current: '',
          sharedCurrent: '',
          p1Prev: '',
          p2Prev: '',
          sharedPrev: '',
          totalBill: '',
          sharedUsers: '',
        });
        setCurrentCalc(null);
        showToast(t.clearEbillStorageSuccess, 'success');
        setConfirmModal(null);
      },
    });
  };

  // Cloud Sync
  const handleSyncLocalToCloud = async () => {
    if (!user) return;
    const localHistory = getStoredHistory();
    for (const record of localHistory) {
      await saveHistoryToCloud(user, record);
    }
    const cloudHistory = await fetchHistoryFromCloud(user);
    setHistory(cloudHistory);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      <div>
        {/* Unified Header */}
        <UnifiedHeader
          currentRoute="/ebillcalculator"
          lang={lang}
          theme={theme}
          user={user}
          housePlanData={null}
          onNavigateRoute={onNavigateRoute}
          onToggleLang={onToggleLang}
          onToggleTheme={onToggleTheme}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 relative z-10">
          <AnimatePresence mode="wait">
            {/* TAB 1: CALCULATOR */}
            {activeTab === 'calc' && (
              <motion.div
                key="calc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="space-y-4 sm:space-y-5"
              >
              {/* Step 1: Current Month Readings */}
              <StepCurrent
                inputs={inputs}
                names={names}
                lang={lang}
                onInputChange={handleInputChange}
                onNameChange={handleNameChange}
              />

              {/* Step 2: Previous Month Readings */}
              <StepPrevious
                inputs={inputs}
                names={names}
                lang={lang}
                onInputChange={handleInputChange}
                onFillPrevious={handleFillPrevious}
              />

              {/* Step 3: Total Bill and Shared Split */}
              <StepTotal
                inputs={inputs}
                lang={lang}
                onInputChange={handleInputChange}
              />

              {/* Action Buttons */}
              <div className="pt-2 space-y-3">
                {/* Auto-Save Checkbox Toggle */}
                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 cursor-pointer backdrop-blur-sm select-none hover:bg-white/80 dark:hover:bg-slate-900/80 transition group">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => {
                      setAutoSave(e.target.checked);
                      localStorage.setItem('ebill_autosave', String(e.target.checked));
                    }}
                    className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800 transition cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {t.autoSaveCheckbox}
                    </span>
                  </div>
                </label>

                {/* Calculate Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleCalculate}
                  className="w-full flex items-center justify-center gap-2.5 py-4 sm:py-4.5 px-6 rounded-2xl font-black text-base sm:text-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/25 transition-all duration-200 group"
                >
                  <Zap className="w-5 h-5 fill-current group-hover:scale-125 transition duration-200" />
                  <span className="tracking-tight">{t.calculate}</span>
                </motion.button>

                {/* Clear Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleClear}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-400 backdrop-blur-md bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.clear}</span>
                </motion.button>
              </div>

              {/* Results */}
              {currentCalc && (
                <div ref={resultsRef} className="pt-3">
                  <ResultsCard
                    data={currentCalc}
                    lang={lang}
                    onCopyViber={handleCopyViber}
                    onOpenReceipt={() => setIsReceiptOpen(true)}
                  />
                </div>
              )}
              </motion.div>
            )}

            {/* TAB 2: HISTORY */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <HistorySection
                  history={history}
                  lang={lang}
                  isCloudMode={user !== null}
                  onLoadRecord={handleLoadRecord}
                  onDeleteRecord={handleDeleteRecord}
                  onClearAll={handleClearAllHistory}
                />
              </motion.div>
            )}

            {/* TAB 3: BACKUP / RESTORE */}
            {activeTab === 'backup' && (
              <motion.div
                key="backup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <BackupSection
                  lang={lang}
                  onDownloadBackup={handleDownloadBackup}
                  onRestoreBackup={handleRestoreBackup}
                  onClearLocalStorage={handleClearLocalStorage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Version Update / Patch Notes Modal */}
      <VersionUpdateModal
        isOpen={isVersionOpen}
        lang={lang}
        onClose={handleCloseVersionModal}
        onToggleLang={onToggleLang}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        lang={lang}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Account Modal (Profile / Cloud Sync / Logout) */}
      <AccountModal
        isOpen={isAccountOpen}
        user={user}
        lang={lang}
        onClose={() => setIsAccountOpen(false)}
        onSyncLocalToCloud={handleSyncLocalToCloud}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        data={currentCalc}
        lang={lang}
        onClose={() => setIsReceiptOpen(false)}
        onCopyText={handleCopyViber}
      />

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmModal?.isOpen ?? false}
        message={confirmModal?.message ?? ''}
        lang={lang}
        onConfirm={() => confirmModal?.onConfirm()}
        onCancel={() => setConfirmModal(null)}
      />

      {/* Toast Feedback */}
      <Toast
        message={toast?.message ?? null}
        type={toast?.type}
        onClose={() => setToast(null)}
      />

      {/* Bottom Navigation Bar for Mobile-first thumb access */}
      <BottomNavBar
        mode={{
          type: 'ebill',
          activeTab,
          onTabChange: setActiveTab,
          historyCount: history.length,
        }}
        lang={lang}
      />

      {/* Footer */}
      <footer className="text-center py-5 pb-24 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/80 mt-10 no-print font-medium relative z-10">
        <button
          type="button"
          onClick={() => setIsVersionOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition font-bold shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{CURRENT_VERSION} EBillCalculator | Patch Notes</span>
        </button>
        <div className="mt-1.5">© 2026 Htet Oo Wai Yan</div>
      </footer>
    </div>
  );
};
