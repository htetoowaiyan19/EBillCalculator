import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Language, Theme } from '../../types';
import {
  CustomCategoryTarget,
  CustomConstructionStage,
  CustomTaskCheckmark,
  ExpenseItem,
  HouseManagerDocument,
  HousePlanTab,
  ManagerMember,
  ManagerPermissions,
  ManagerRole,
} from '../../types/housePlanTypes';
import { housePlanTranslations } from '../../constants/housePlanTranslations';
import {
  getActiveManagerId,
  getRecentManagerIds,
  setActiveManagerId,
  subscribeHouseManager,
  updateHouseManagerInFirestore,
  deleteHouseManagerFromFirestore,
  clearHousePlanLocalStorage,
} from '../../services/housePlanFirebase';
import { UnifiedHeader } from '../navigation/UnifiedHeader';
import { BottomNavBar } from '../navigation/BottomNavBar';
import { HousePlanOverview } from './HousePlanOverview';
import { HousePlanExpenses } from './HousePlanExpenses';
import { HousePlanStages } from './HousePlanStages';
import { HousePlanDataSection } from './HousePlanDataModal';
import { HousePlanAuthGate } from './HousePlanAuthGate';
import { HousePlanMemberPermissionsModal } from './HousePlanMemberPermissionsModal';
import { AuthModal } from '../AuthModal';
import { AccountModal } from '../AccountModal';
import { Toast } from '../Toast';
import { Sparkles, Loader2 } from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

interface HousePlanAppProps {
  lang: Language;
  theme: Theme;
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onNavigateRoute: (route: '/ebillcalculator' | '/houseplan') => void;
  onBottomNavPresenceChange?: (present: boolean) => void;
}

export const HousePlanApp: React.FC<HousePlanAppProps> = ({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  onNavigateRoute,
  onBottomNavPresenceChange,
}) => {
  const t = housePlanTranslations[lang];

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active Manager and Real-time subscription state
  const [activeManagerId, setActiveIdState] = useState<string | null>(() => getActiveManagerId());
  const [manager, setManager] = useState<HouseManagerDocument | null>(null);
  const [managerLoading, setManagerLoading] = useState(false);
  const [recentManagerIds, setRecentManagerIds] = useState<string[]>(() => getRecentManagerIds());

  // UI Tabs & Modals
  const [activeTab, setActiveTab] = useState<HousePlanTab>('overview');
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  // 1. Listen to Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // 2. Real-time Firestore subscription to active manager
  useEffect(() => {
    if (!activeManagerId || !user) {
      setManager(null);
      setManagerLoading(false);
      return;
    }

    setManagerLoading(true);
    const unsub = subscribeHouseManager(
      activeManagerId,
      (data) => {
        setManager(data);
        setManagerLoading(false);
        if (data) {
          setRecentManagerIds(getRecentManagerIds());
        }
      },
      (err) => {
        console.error('Subscription error:', err);
        setManagerLoading(false);
      }
    );

    return () => unsub();
  }, [activeManagerId, user]);

  // Report bottom nav bar presence to parent (only present when user has active manager loaded)
  useEffect(() => {
    const hasNav = Boolean(user && activeManagerId && manager);
    onBottomNavPresenceChange?.(hasNav);
  }, [user, activeManagerId, manager, onBottomNavPresenceChange]);

  // Handler to switch or set active manager
  const handleManagerLoaded = (managerId: string) => {
    setActiveIdState(managerId);
    setActiveManagerId(managerId);
    setRecentManagerIds(getRecentManagerIds());
  };

  // Handler to leave/switch active manager
  const handleSwitchManager = () => {
    setActiveIdState(null);
    setActiveManagerId(null);
    setManager(null);
  };

  // Handler to clear local storage data
  const handleClearLocalStorage = () => {
    clearHousePlanLocalStorage();
    setRecentManagerIds([]);
  };

  // Handler to entirely delete manager from server (Admin only)
  const handleDeleteManager = async (managerId: string) => {
    if (!manager || userRole !== 'admin') {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    await deleteHouseManagerFromFirestore(managerId);
    setActiveIdState(null);
    setActiveManagerId(null);
    setManager(null);
    setRecentManagerIds(getRecentManagerIds());
    showToast(t.managerDeletedSuccess, 'success');
  };

  // Determine current user's role and permissions
  const isCreator = Boolean(user && manager && manager.creatorUid === user.uid);
  const currentMember = manager?.members?.find((m) => m.uid === user?.uid);

  const userRole: ManagerRole = isCreator
    ? 'admin'
    : currentMember?.role || 'editor';

  const permissions: ManagerPermissions = {
    canEditExpenses: isCreator || (currentMember?.permissions?.canEditExpenses ?? true),
    canEditStages: isCreator || (currentMember?.permissions?.canEditStages ?? true),
    canEditCategories: isCreator || (currentMember?.permissions?.canEditCategories ?? false),
    canManageUsers: isCreator || (currentMember?.permissions?.canManageUsers ?? false),
  };

  // ===== Action Handlers with Firestore Persistence =====

  // Add Expense
  const handleAddExpense = async (itemData: Omit<ExpenseItem, 'id' | 'createdAt'>) => {
    if (!manager || !permissions.canEditExpenses) {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    const newItem: ExpenseItem = {
      ...itemData,
      id: `exp_${Date.now()}`,
      createdAt: Date.now(),
    };
    const updatedExpenses = [newItem, ...manager.expenses];
    await updateHouseManagerInFirestore(manager.managerId, { expenses: updatedExpenses });
    showToast(t.expenseAddedSuccess);
  };

  // Edit Expense
  const handleEditExpense = async (updated: ExpenseItem) => {
    if (!manager || !permissions.canEditExpenses) {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    const updatedExpenses = manager.expenses.map((e) => (e.id === updated.id ? updated : e));
    await updateHouseManagerInFirestore(manager.managerId, { expenses: updatedExpenses });
    showToast(t.expenseUpdatedSuccess);
  };

  // Delete Expense
  const handleDeleteExpense = async (id: string) => {
    if (!manager || !permissions.canEditExpenses) {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    const updatedExpenses = manager.expenses.filter((e) => e.id !== id);
    await updateHouseManagerInFirestore(manager.managerId, { expenses: updatedExpenses });
    showToast(t.expenseDeletedSuccess);
  };

  // Toggle Payment Status
  const handleToggleStatus = async (id: string) => {
    if (!manager || !permissions.canEditExpenses) return;
    const updatedExpenses = manager.expenses.map((e) => {
      if (e.id === id) {
        return { ...e, status: e.status === 'paid' ? ('pending' as const) : ('paid' as const) };
      }
      return e;
    });
    await updateHouseManagerInFirestore(manager.managerId, { expenses: updatedExpenses });
  };

  // Update Project Info
  const handleUpdateManagerInfo = async (info: {
    name: string;
    location: string;
    startDate: string;
    targetCompletionDate: string;
  }) => {
    if (!manager || !permissions.canManageUsers) return;
    await updateHouseManagerInFirestore(manager.managerId, info);
    showToast(t.projectUpdatedSuccess);
  };

  // Add Category Target
  const handleAddCategory = async (catData: Omit<CustomCategoryTarget, 'id'>) => {
    if (!manager || !permissions.canEditCategories) {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    const newCat: CustomCategoryTarget = {
      ...catData,
      id: `cat_${Date.now()}`,
    };
    const updatedCategories = [...manager.categories, newCat];
    await updateHouseManagerInFirestore(manager.managerId, { categories: updatedCategories });
    showToast(t.categoryAddedSuccess);
  };

  // Update Category Target
  const handleUpdateCategory = async (updated: CustomCategoryTarget) => {
    if (!manager || !permissions.canEditCategories) {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    const updatedCategories = manager.categories.map((c) => (c.id === updated.id ? updated : c));
    await updateHouseManagerInFirestore(manager.managerId, { categories: updatedCategories });
    showToast(t.categoryUpdatedSuccess);
  };

  // Delete Category Target
  const handleDeleteCategory = async (categoryId: string) => {
    if (!manager || !permissions.canEditCategories) {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    const updatedCategories = manager.categories.filter((c) => c.id !== categoryId);
    await updateHouseManagerInFirestore(manager.managerId, { categories: updatedCategories });
    showToast(t.categoryDeletedSuccess);
  };

  // Add Custom Stage
  const handleAddStage = async (stageData: Omit<CustomConstructionStage, 'id' | 'order'>) => {
    if (!manager || !permissions.canEditStages) {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    const newStage: CustomConstructionStage = {
      ...stageData,
      id: `stg_${Date.now()}`,
      order: manager.stages.length + 1,
    };
    const updatedStages = [...manager.stages, newStage];
    await updateHouseManagerInFirestore(manager.managerId, { stages: updatedStages });
    showToast(t.stageAddedSuccess);
  };

  // Update Stage
  const handleUpdateStage = async (updatedStage: CustomConstructionStage) => {
    if (!manager || !permissions.canEditStages) return;
    const updatedStages = manager.stages.map((s) => (s.id === updatedStage.id ? updatedStage : s));
    await updateHouseManagerInFirestore(manager.managerId, { stages: updatedStages });
  };

  // Delete Stage
  const handleDeleteStage = async (stageId: string) => {
    if (!manager || !permissions.canEditStages) {
      showToast(t.noPermissionToast, 'warning');
      return;
    }
    const updatedStages = manager.stages.filter((s) => s.id !== stageId);
    await updateHouseManagerInFirestore(manager.managerId, { stages: updatedStages });
    showToast(t.stageDeletedSuccess);
  };

  // Add Task Checkmark to Stage
  const handleAddTask = async (stageId: string, taskTitle: string) => {
    if (!manager || !permissions.canEditStages) return;
    const newTask: CustomTaskCheckmark = {
      id: `t_${Date.now()}`,
      title: taskTitle,
      completed: false,
    };
    const updatedStages = manager.stages.map((s) => {
      if (s.id === stageId) {
        return { ...s, tasks: [...s.tasks, newTask] };
      }
      return s;
    });
    await updateHouseManagerInFirestore(manager.managerId, { stages: updatedStages });
  };

  // Toggle Task Checkmark
  const handleToggleTask = async (stageId: string, taskId: string) => {
    if (!manager || !permissions.canEditStages) return;
    const updatedStages = manager.stages.map((s) => {
      if (s.id === stageId) {
        const updatedTasks = s.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const allCompleted = updatedTasks.length > 0 && updatedTasks.every((t) => t.completed);
        const someCompleted = updatedTasks.some((t) => t.completed);
        const newStatus = allCompleted ? 'completed' : someCompleted ? 'in_progress' : s.status;
        return { ...s, tasks: updatedTasks, status: newStatus as any };
      }
      return s;
    });
    await updateHouseManagerInFirestore(manager.managerId, { stages: updatedStages });
  };

  // Delete Task Checkmark
  const handleDeleteTask = async (stageId: string, taskId: string) => {
    if (!manager || !permissions.canEditStages) return;
    const updatedStages = manager.stages.map((s) => {
      if (s.id === stageId) {
        return { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) };
      }
      return s;
    });
    await updateHouseManagerInFirestore(manager.managerId, { stages: updatedStages });
  };

  // Clear All Stages
  const handleClearAllStages = async () => {
    if (!manager || !permissions.canEditStages) return;
    await updateHouseManagerInFirestore(manager.managerId, { stages: [] });
    showToast(lang === 'MY' ? 'ဆောက်လုပ်ရေးအဆင့်များ အားလုံး ရှင်းလင်းပြီးပါပြီ' : 'All construction stages cleared');
  };

  // Update Members / Permissions
  const handleUpdateMembers = async (updatedMembers: ManagerMember[]) => {
    if (!manager || !isCreator) return;
    await updateHouseManagerInFirestore(manager.managerId, { members: updatedMembers });
  };

  // Restore Manager Backup
  const handleRestoreManager = async (restored: HouseManagerDocument) => {
    if (!manager || !isCreator) return;
    await updateHouseManagerInFirestore(manager.managerId, {
      name: restored.name || manager.name,
      location: restored.location || manager.location,
      categories: restored.categories || manager.categories,
      expenses: restored.expenses || manager.expenses,
      stages: restored.stages || manager.stages,
    });
  };

  // Check if Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  // If user is NOT authenticated OR does NOT have an active manager loaded:
  // Render the Mobile-first AuthGate!
  if (!user || !activeManagerId || !manager) {
    return (
      <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-white">
        <div>
          <UnifiedHeader
            currentRoute="/houseplan"
            lang={lang}
            theme={theme}
            user={user}
            housePlanData={null}
            onNavigateRoute={onNavigateRoute}
            onToggleLang={onToggleLang}
            onToggleTheme={onToggleTheme}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenAccount={() => setIsAccountModalOpen(true)}
          />
          <HousePlanAuthGate
            user={user}
            lang={lang}
            recentManagerIds={recentManagerIds}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onManagerLoaded={handleManagerLoaded}
            onShowToast={showToast}
            onClearLocalStorage={handleClearLocalStorage}
          />
        </div>

        {/* Auth Modal (Google / Email Sign In) */}
        <AuthModal
          isOpen={isAuthModalOpen}
          lang={lang}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(msg) => showToast(msg)}
        />

        {/* Account Modal (Profile & Sign Out) */}
        <AccountModal
          isOpen={isAccountModalOpen}
          user={user}
          lang={lang}
          onClose={() => setIsAccountModalOpen(false)}
          onSyncLocalToCloud={() =>
            showToast(
              lang === 'MY'
                ? 'Cloud Database သို့ ချိတ်ဆက်ထားပြီးဖြစ်ပါသည်'
                : 'Connected to Firestore Cloud Database',
              'success'
            )
          }
          onSuccess={(msg) => showToast(msg)}
        />

        {/* Toast Feedback */}
        <Toast
          message={toast?.message ?? null}
          type={toast?.type}
          onClose={() => setToast(null)}
        />
      </div>
    );
  }

  const completedStagesCount = manager.stages.filter((s) => s.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      <div>
        {/* Unified Top Navigation Bar */}
        <UnifiedHeader
          currentRoute="/houseplan"
          lang={lang}
          theme={theme}
          user={user}
          housePlanData={{
            managerName: manager.name,
            managerId: manager.managerId,
            userRole: userRole,
            onOpenMembersModal: () => setIsMembersModalOpen(true),
            onSwitchManager: handleSwitchManager,
          }}
          onNavigateRoute={onNavigateRoute}
          onToggleLang={onToggleLang}
          onToggleTheme={onToggleTheme}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onOpenAccount={() => setIsAccountModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 relative z-10">
          {/* Loading Indicator for Firestore updates */}
          {managerLoading && (
            <div className="mb-3 p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{lang === 'MY' ? 'Firestore သို့ အချက်အလက်များ ချိတ်ဆက်နေပါသည်...' : 'Syncing with Firestore...'}</span>
            </div>
          )}

          {/* Fluid Tab Content with AnimatePresence */}
          <AnimatePresence mode="wait">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <HousePlanOverview
                  manager={manager}
                  permissions={permissions}
                  lang={lang}
                  onUpdateManagerInfo={handleUpdateManagerInfo}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              </motion.div>
            )}

            {/* TAB 2: EXPENSES */}
            {activeTab === 'expenses' && (
              <motion.div
                key="expenses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <HousePlanExpenses
                  expenses={manager.expenses}
                  categories={manager.categories}
                  permissions={permissions}
                  lang={lang}
                  onAddExpense={handleAddExpense}
                  onEditExpense={handleEditExpense}
                  onDeleteExpense={handleDeleteExpense}
                  onToggleStatus={handleToggleStatus}
                />
              </motion.div>
            )}

            {/* TAB 3: STAGES */}
            {activeTab === 'stages' && (
              <motion.div
                key="stages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <HousePlanStages
                  stages={manager.stages}
                  permissions={permissions}
                  lang={lang}
                  onAddStage={handleAddStage}
                  onUpdateStage={handleUpdateStage}
                  onDeleteStage={handleDeleteStage}
                  onClearAllStages={handleClearAllStages}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                />
              </motion.div>
            )}

            {/* TAB 4: DATA & TEAM */}
            {activeTab === 'data' && (
              <motion.div
                key="data"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <HousePlanDataSection
                  manager={manager}
                  lang={lang}
                  userRole={userRole}
                  onRestoreManager={handleRestoreManager}
                  onOpenMembersModal={() => setIsMembersModalOpen(true)}
                  onSwitchManager={handleSwitchManager}
                  onDeleteManager={handleDeleteManager}
                  onClearLocalStorage={handleClearLocalStorage}
                  onShowToast={showToast}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Member Permissions Modal */}
      {user && (
        <HousePlanMemberPermissionsModal
          isOpen={isMembersModalOpen}
          manager={manager}
          currentUserUid={user.uid}
          lang={lang}
          onClose={() => setIsMembersModalOpen(false)}
          onUpdateMembers={handleUpdateMembers}
          onShowToast={showToast}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        lang={lang}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(msg) => showToast(msg)}
      />

      {/* Account Modal (Profile & Sign Out) */}
      <AccountModal
        isOpen={isAccountModalOpen}
        user={user}
        lang={lang}
        onClose={() => setIsAccountModalOpen(false)}
        onSyncLocalToCloud={() =>
          showToast(
            lang === 'MY'
              ? 'Cloud Database သို့ ချိတ်ဆက်ထားပြီးဖြစ်ပါသည်'
              : 'Connected to Firestore Cloud Database',
            'success'
          )
        }
        onSuccess={(msg) => showToast(msg)}
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
          type: 'houseplan',
          activeTab,
          onTabChange: setActiveTab,
          expenseCount: manager.expenses.length,
          completedStagesCount: completedStagesCount,
          totalStagesCount: manager.stages.length,
        }}
        lang={lang}
      />

      {/* Footer */}
      <footer className="text-center py-4 pb-24 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200/60 dark:border-slate-800/80 mt-8 no-print font-medium relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold shadow-sm mb-1 text-[11px]">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>HousePlan Manager • ID: {manager.managerId}</span>
        </div>
        <div>© 2026 Htet Oo Wai Yan</div>
      </footer>
    </div>
  );
};
