import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { Header } from './components/Header';
import { StepCurrent } from './components/StepCurrent';
import { StepPrevious } from './components/StepPrevious';
import { StepTotal } from './components/StepTotal';
import { ResultsCard } from './components/ResultsCard';
import { ReceiptModal } from './components/ReceiptModal';
import { VersionUpdateModal, CURRENT_VERSION } from './components/VersionUpdateModal';
import { HistorySection } from './components/HistorySection';
import { BackupSection } from './components/BackupSection';
import { ConfirmModal } from './components/ConfirmModal';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { Toast } from './components/Toast';
import { ActiveTab, CalculationRecord, CustomNames, Language, MeterInputs, Theme } from './types';
import { translations } from './constants/translations';
import { calculateBill, generateViberText } from './utils/calculation';
import {
  getStoredHistory,
  getStoredLang,
  getStoredNames,
  getStoredPrevious,
  getStoredTheme,
  saveHistoryRecord,
  deleteHistoryRecord,
  clearAllHistory,
  setStoredLang,
  setStoredNames,
  setStoredPrevious,
  setStoredTheme,
  exportBackupJson,
  importBackupJson,
} from './utils/storage';
import {
  saveHistoryToCloud,
  fetchHistoryFromCloud,
  deleteHistoryFromCloud,
  savePreviousToCloud,
  fetchPreviousFromCloud,
} from './services/firebase';
import { RotateCcw, Zap, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Application State
  const [lang, setLang] = useState<Language>(() => getStoredLang());
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
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
      sharedUsers: '3',
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

  // Synchronize Theme with Document Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStoredTheme(theme);
  }, [theme]);

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
          // ignore
        }
      } else {
        // Logged-out: use local storage
        setHistory(getStoredHistory());
      }
    });

    return () => unsubscribe();
  }, []);

  // Language switcher
  const handleToggleLang = () => {
    const newLang = lang === 'MY' ? 'EN' : 'MY';
    setLang(newLang);
    setStoredLang(newLang);
    showToast(newLang === 'MY' ? 'မြန်မာဘာသာသို့ ပြောင်းပြီးပါပြီ' : 'Switched to English');
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  // Close Version Update Modal & save to localStorage
  const handleCloseVersionModal = () => {
    setIsVersionOpen(false);
    localStorage.setItem('ebill_last_seen_version', CURRENT_VERSION);
  };

  // Input Handlers
  const handleInputChange = (field: keyof MeterInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (field: keyof CustomNames, value: string) => {
    const updated = { ...names, [field]: value };
    setNames(updated);
    setStoredNames(updated);
  };

  // Fill Previous Action
  const handleFillPrevious = async () => {
    let saved = getStoredPrevious();
    if (user) {
      try {
        const cloudPrev = await fetchPreviousFromCloud(user);
        if (cloudPrev) saved = cloudPrev;
      } catch {
        // fallback
      }
    }

    if (!saved || (saved.p1 === undefined && saved.p2 === undefined && saved.shared === undefined)) {
      showToast(t.fillPreviousEmpty, 'warning');
      return;
    }

    setInputs((prev) => ({
      ...prev,
      p1Prev: saved.p1 !== undefined ? String(saved.p1) : prev.p1Prev,
      p2Prev: saved.p2 !== undefined ? String(saved.p2) : prev.p2Prev,
      sharedPrev: saved.shared !== undefined ? String(saved.shared) : prev.sharedPrev,
    }));
    showToast(`✅ ${t.fillPreviousSuccess}`);
  };

  // Reset / Clear Inputs
  const handleClear = () => {
    setInputs({
      p1Current: '',
      p2Current: '',
      sharedCurrent: '',
      p1Prev: '',
      p2Prev: '',
      sharedPrev: '',
      totalBill: '',
      sharedUsers: '3',
    });
    setCurrentCalc(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate Action (Auto-saves to History if checkbox is checked)
  const handleCalculate = async () => {
    const result = calculateBill(inputs, names, lang);
    if (!result.success) {
      showToast(`⚠️ ${t[result.errorKey]}`, 'warning');
      return;
    }

    const calcData = result.data;
    setCurrentCalc(calcData);

    // Save previous readings snapshot for next month
    const prevData = {
      p1: calcData.p1Current,
      p2: calcData.p2Current,
      shared: calcData.sharedCurrent,
    };
    setStoredPrevious(prevData);

    if (user) {
      try {
        await savePreviousToCloud(user, prevData);
      } catch {
        // ignore
      }
    }

    // Auto-save to History if checkbox is checked
    if (autoSave) {
      if (user) {
        // Cloud mode
        try {
          const cloudId = await saveHistoryToCloud(user, calcData);
          const recordWithCloudId = { ...calcData, id: cloudId };
          setHistory((prev) => [recordWithCloudId, ...prev.filter((p) => p.id !== cloudId)]);
          saveHistoryRecord(recordWithCloudId);
          showToast(`✅ ${t.savedSuccess} (Cloud)`);
        } catch {
          const updated = saveHistoryRecord(calcData);
          setHistory(updated);
          showToast(`✅ ${t.savedSuccess}`);
        }
      } else {
        // Local mode
        const updated = saveHistoryRecord(calcData);
        setHistory(updated);
        showToast(`✅ ${t.savedSuccess}`);
      }
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  // Viber Share Action
  const handleCopyViber = async () => {
    if (!currentCalc) return;
    const msg = generateViberText(currentCalc, lang);
    try {
      await navigator.clipboard.writeText(msg);
      showToast(`✅ ${t.copiedToast}`);
    } catch {
      showToast('⚠️ Failed to copy', 'warning');
    }
  };

  // Load Record from History
  const handleLoadRecord = (record: CalculationRecord) => {
    setInputs({
      p1Current: String(record.p1Current),
      p2Current: String(record.p2Current),
      sharedCurrent: String(record.sharedCurrent),
      p1Prev: String(record.p1Prev),
      p2Prev: String(record.p2Prev),
      sharedPrev: String(record.sharedPrev),
      totalBill: String(record.totalBill),
      sharedUsers: String(record.sharedUsers || 3),
    });
    setCurrentCalc(record);
    setActiveTab('calc');
    showToast(`✅ ${t.loadedToCalcSuccess}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Single History Record
  const handleDeleteRecord = (id: string) => {
    setConfirmModal({
      isOpen: true,
      message: t.confirmDelete,
      onConfirm: async () => {
        if (user) {
          try {
            await deleteHistoryFromCloud(id);
          } catch {
            // ignore
          }
        }
        const updated = deleteHistoryRecord(id);
        setHistory(updated);
        setConfirmModal(null);
        showToast('🗑️ Deleted');
      },
    });
  };

  // Clear All History
  const handleClearAllHistory = () => {
    setConfirmModal({
      isOpen: true,
      message: t.confirmDeleteAll,
      onConfirm: async () => {
        if (user) {
          for (const item of history) {
            try {
              await deleteHistoryFromCloud(item.id);
            } catch {
              // ignore
            }
          }
        }
        clearAllHistory();
        setHistory([]);
        setConfirmModal(null);
        showToast('🗑️ All history cleared');
      },
    });
  };

  // Sync Local History to Cloud
  const handleSyncLocalToCloud = async () => {
    if (!user) return;
    const localList = getStoredHistory();
    if (localList.length === 0) {
      showToast(t.noHistory, 'warning');
      return;
    }

    try {
      for (const item of localList) {
        await saveHistoryToCloud(user, item);
      }
      const cloudHistory = await fetchHistoryFromCloud(user);
      setHistory(cloudHistory);
      showToast(`✅ ${t.syncSuccess}`);
      setIsAccountOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      showToast(`⚠️ Sync error: ${errorObj.message || 'Error'}`, 'warning');
    }
  };

  // Backup Download Action
  const handleDownloadBackup = () => {
    exportBackupJson();
    showToast('📥 Backup file downloaded');
  };

  // Backup Restore Action
  const handleRestoreBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const res = importBackupJson(content);
      if (res.success) {
        setHistory(res.data.history || []);
        if (res.data.names) setNames(res.data.names);
        showToast(`✅ ${t.restoreSuccess}`);
      } else {
        showToast(`❌ ${t.restoreInvalid}`, 'warning');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden">
      {/* Ambient background glow orbs */}
      <div className="ambient-glow" aria-hidden="true">
        <div className="orb-1"></div>
        <div className="orb-2"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <Header
          lang={lang}
          theme={theme}
          activeTab={activeTab}
          user={user}
          onToggleLang={handleToggleLang}
          onToggleTheme={handleToggleTheme}
          onTabChange={setActiveTab}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
        />

        {/* Main Body */}
        <main className="max-w-2xl mx-auto px-4 py-5 sm:py-7">
          {/* TAB 1: CALCULATOR */}
          {activeTab === 'calc' && (
            <div className="space-y-4">
              <StepCurrent
                inputs={inputs}
                names={names}
                lang={lang}
                onInputChange={handleInputChange}
                onNameChange={handleNameChange}
              />

              <StepPrevious
                inputs={inputs}
                names={names}
                lang={lang}
                onInputChange={handleInputChange}
                onFillPrevious={handleFillPrevious}
              />

              <StepTotal
                inputs={inputs}
                lang={lang}
                onInputChange={handleInputChange}
              />

              {/* Auto-save to history checkbox & Action Buttons */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3.5 p-4 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark cursor-pointer select-none hover:bg-white/90 dark:hover:bg-slate-900/90 transition-all duration-200 group">
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
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="w-full flex items-center justify-center gap-2.5 py-4 sm:py-4.5 px-6 rounded-2xl font-black text-base sm:text-lg text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] shadow-xl shadow-blue-500/25 transition-all duration-200 group"
                >
                  <Zap className="w-5 h-5 fill-current group-hover:scale-125 transition duration-200" />
                  <span className="tracking-tight">{t.calculate}</span>
                </button>

                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-400 backdrop-blur-md bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 active:scale-[0.98] transition shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.clear}</span>
                </button>
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
            </div>
          )}

          {/* TAB 2: HISTORY */}
          {activeTab === 'history' && (
            <HistorySection
              history={history}
              lang={lang}
              isCloudMode={user !== null}
              onLoadRecord={handleLoadRecord}
              onDeleteRecord={handleDeleteRecord}
              onClearAll={handleClearAllHistory}
            />
          )}

          {/* TAB 3: BACKUP / RESTORE */}
          {activeTab === 'backup' && (
            <BackupSection
              lang={lang}
              onDownloadBackup={handleDownloadBackup}
              onRestoreBackup={handleRestoreBackup}
            />
          )}
        </main>
      </div>

      {/* Version Update / Patch Notes Modal */}
      <VersionUpdateModal
        isOpen={isVersionOpen}
        lang={lang}
        onClose={handleCloseVersionModal}
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

      {/* Footer */}
      <footer className="text-center py-5 text-xs text-slate-400 dark:text-slate-500 border-t border-white/60 dark:border-slate-800/80 mt-10 no-print font-medium relative z-10">
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
