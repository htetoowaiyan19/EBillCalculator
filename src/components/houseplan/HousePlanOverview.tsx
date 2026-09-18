import React, { useState } from 'react';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Percent,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
  Edit2,
  Save,
  X,
  Layers,
  ArrowRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { Language } from '../../types';
import {
  CustomCategoryTarget,
  HouseManagerDocument,
  ManagerPermissions,
} from '../../types/housePlanTypes';
import { housePlanTranslations } from '../../constants/housePlanTranslations';
import { formatMMK, formatLakhs } from '../../utils/housePlanStorage';

interface HousePlanOverviewProps {
  manager: HouseManagerDocument;
  permissions: ManagerPermissions;
  lang: Language;
  onUpdateManagerInfo: (info: {
    name: string;
    location: string;
    startDate: string;
    targetCompletionDate: string;
  }) => void;
  onAddCategory: (category: Omit<CustomCategoryTarget, 'id'>) => void;
  onUpdateCategory: (category: CustomCategoryTarget) => void;
  onDeleteCategory: (categoryId: string) => void;
  onNavigateTab: (tab: 'expenses' | 'stages') => void;
}

export const HousePlanOverview: React.FC<HousePlanOverviewProps> = ({
  manager,
  permissions,
  lang,
  onUpdateManagerInfo,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onNavigateTab,
}) => {
  const t = housePlanTranslations[lang];

  // Edit Project Details State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    name: manager.name,
    location: manager.location,
    startDate: manager.startDate,
    targetCompletionDate: manager.targetCompletionDate,
  });

  // Modal: Add Custom Category
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatForm, setNewCatForm] = useState({
    nameMY: '',
    nameEN: '',
    targetBudget: '',
  });

  // Modal: Edit Category Target
  const [editingCategory, setEditingCategory] = useState<CustomCategoryTarget | null>(null);
  const [editTargetBudget, setEditTargetBudget] = useState('');

  // Delete category target confirm
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  // Calculate totals dynamically
  // 1. Total Planned Budget = sum of all category targets!
  const totalPlannedBudget = manager.categories.reduce(
    (sum, cat) => sum + (Number(cat.targetBudget) || 0),
    0
  );

  // 2. Total Spent = sum of all expenses
  const totalSpent = manager.expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  // 3. Remaining Budget & %
  const remainingBudget = totalPlannedBudget - totalSpent;
  const percentSpent = totalPlannedBudget > 0 ? (totalSpent / totalPlannedBudget) * 100 : 0;
  const isOverBudget = remainingBudget < 0;
  const isWarning = percentSpent >= 80 && !isOverBudget;

  // Compute spent per category key/id
  const categorySpentMap: Record<string, number> = {};
  manager.categories.forEach((cat) => {
    categorySpentMap[cat.key] = 0;
  });

  manager.expenses.forEach((item) => {
    if (categorySpentMap[item.category] !== undefined) {
      categorySpentMap[item.category] += Number(item.amount) || 0;
    } else {
      categorySpentMap[item.category] = (categorySpentMap[item.category] || 0) + (Number(item.amount) || 0);
    }
  });

  // Handle Save Project Details
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateManagerInfo({
      name: infoForm.name.trim() || manager.name,
      location: infoForm.location.trim() || manager.location,
      startDate: infoForm.startDate,
      targetCompletionDate: infoForm.targetCompletionDate,
    });
    setIsEditingInfo(false);
  };

  // Handle Add Category
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatForm.nameMY.trim() && !newCatForm.nameEN.trim()) return;

    const parsedTarget = parseFloat(newCatForm.targetBudget);
    const key = `custom_${Date.now()}`;

    onAddCategory({
      key,
      nameMY: newCatForm.nameMY.trim() || newCatForm.nameEN.trim(),
      nameEN: newCatForm.nameEN.trim() || newCatForm.nameMY.trim(),
      targetBudget: !isNaN(parsedTarget) && parsedTarget > 0 ? parsedTarget : 0,
      isCustom: true,
    });

    setNewCatForm({ nameMY: '', nameEN: '', targetBudget: '' });
    setIsAddCategoryOpen(false);
  };

  // Handle Edit Category Target
  const handleEditCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    const parsed = parseFloat(editTargetBudget);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateCategory({
        ...editingCategory,
        targetBudget: parsed,
      });
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-5">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Total Planned Budget */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-5 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark relative overflow-hidden group">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.totalBudget}
            </span>
            <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatMMK(totalPlannedBudget)} <span className="text-[10px] sm:text-xs font-semibold text-slate-500">{t.currencySymbol}</span>
          </div>
          <div className="mt-1 text-[11px] sm:text-xs font-extrabold text-blue-600 dark:text-blue-400">
            ≈ {formatLakhs(totalPlannedBudget, lang)}
          </div>
        </div>

        {/* Total Spent */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-5 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark relative overflow-hidden group">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.totalSpent}
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {formatMMK(totalSpent)} <span className="text-[10px] sm:text-xs font-semibold text-slate-500">{t.currencySymbol}</span>
          </div>
          <div className="mt-1 text-[11px] sm:text-xs font-extrabold text-amber-600 dark:text-amber-400">
            ≈ {formatLakhs(totalSpent, lang)} ({manager.expenses.length} items)
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-5 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark relative overflow-hidden group">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.remainingBudget}
            </span>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                isOverBudget
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div
            className={`text-lg sm:text-2xl font-black tracking-tight truncate ${
              isOverBudget
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isOverBudget ? '-' : ''}
            {formatMMK(Math.abs(remainingBudget))}{' '}
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500">{t.currencySymbol}</span>
          </div>
          <div
            className={`mt-1 text-[11px] sm:text-xs font-extrabold ${
              isOverBudget
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            ≈ {formatLakhs(Math.abs(remainingBudget), lang)}
          </div>
        </div>

        {/* Budget Health / Progress */}
        <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-5 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark relative overflow-hidden group">
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
              {t.percentSpent}
            </span>
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {percentSpent.toFixed(1)}%
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : isWarning
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-blue-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Budget Status Alert Banner */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border flex items-center gap-3 backdrop-blur-md ${
          isOverBudget
            ? 'bg-rose-500/10 border-rose-300 dark:border-rose-900/60 text-rose-800 dark:text-rose-200'
            : isWarning
            ? 'bg-amber-500/10 border-amber-300 dark:border-amber-900/60 text-amber-800 dark:text-amber-200'
            : 'bg-emerald-500/10 border-emerald-300 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200'
        }`}
      >
        <div className="shrink-0">
          {isOverBudget ? (
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          ) : isWarning ? (
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          )}
        </div>
        <div className="flex-1 text-xs">
          <span className="font-extrabold block text-xs sm:text-sm">
            {isOverBudget
              ? t.budgetHealthDanger
              : isWarning
              ? t.budgetHealthWarning
              : t.budgetHealthSafe}
          </span>
          <span className="opacity-90 font-medium text-[11px] sm:text-xs">
            {isOverBudget
              ? t.budgetHealthDangerDesc
              : isWarning
              ? t.budgetHealthWarningDesc
              : t.budgetHealthSafeDesc}
          </span>
        </div>
      </div>

      {/* Project Details Section */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-6 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark">
        <div className="flex items-center justify-between gap-3 pb-3 mb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-500" />
              {t.projectInfoTitle}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.projectInfoDesc}</p>
          </div>
          {permissions.canManageUsers && !isEditingInfo && (
            <button
              type="button"
              onClick={() => setIsEditingInfo(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 transition"
            >
              <Edit2 className="w-3 h-3" />
              <span>{t.editProjectBtn}</span>
            </button>
          )}
        </div>

        {!isEditingInfo ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
            <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {t.projectNameLabel}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 block truncate">
                {manager.name}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" />
                {t.locationLabel}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 block truncate">
                {manager.location}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-blue-500" />
                {t.startDateLabel}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 block">
                {manager.startDate || '—'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-500" />
                {t.targetDateLabel}
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 block">
                {manager.targetCompletionDate || '—'}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveInfo} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t.projectNameLabel}
                </label>
                <input
                  type="text"
                  value={infoForm.name}
                  onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t.locationLabel}
                </label>
                <input
                  type="text"
                  value={infoForm.location}
                  onChange={(e) => setInfoForm({ ...infoForm, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t.startDateLabel}
                </label>
                <input
                  type="date"
                  value={infoForm.startDate}
                  onChange={(e) => setInfoForm({ ...infoForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  {t.targetDateLabel}
                </label>
                <input
                  type="date"
                  value={infoForm.targetCompletionDate}
                  onChange={(e) =>
                    setInfoForm({ ...infoForm, targetCompletionDate: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.saveProjectBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Category Breakdown Cards & Dynamic Targets */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-6 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-3 mb-3.5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              {t.categoryBreakdownTitle}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.categoryBreakdownDesc}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {permissions.canEditCategories && (
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addCategoryBtn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigateTab('expenses')}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>{t.tabExpenses}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {manager.categories.map((cat) => {
            const spent = categorySpentMap[cat.key] || 0;
            const target = Number(cat.targetBudget) || 0;
            const percent = target > 0 ? (spent / target) * 100 : 0;
            const isCatOver = spent > target && target > 0;
            const catName = lang === 'MY' ? cat.nameMY : cat.nameEN;

            return (
              <div
                key={cat.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-amber-400/50 transition-all duration-200 relative group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 leading-tight truncate">
                      {catName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                        isCatOver
                          ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                          : percent > 80
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {percent.toFixed(0)}%
                    </span>

                    {/* Edit Target Button */}
                    {permissions.canEditCategories && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(cat);
                          setEditTargetBudget(String(cat.targetBudget));
                        }}
                        className="p-1 rounded text-slate-400 hover:text-amber-600 transition"
                        title={t.editCategoryTarget}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}

                    {/* Delete Custom Category Button */}
                    {permissions.canEditCategories && cat.isCustom && (
                      <button
                        type="button"
                        onClick={() => setDeleteCatId(cat.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                        title={t.deleteCategory}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline justify-between text-xs mb-1.5">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {formatMMK(spent)} {t.currencySymbol}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    / {formatLakhs(target, lang)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isCatOver
                        ? 'bg-rose-500'
                        : percent > 80
                        ? 'bg-amber-500'
                        : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add Category Target */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-500" />
                {t.modalAddCategoryTitle}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCategoryOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.inputCategoryNameMY} *
                </label>
                <input
                  type="text"
                  value={newCatForm.nameMY}
                  onChange={(e) => setNewCatForm({ ...newCatForm, nameMY: e.target.value })}
                  placeholder="ဥပမာ - ဆိုလာစနစ် တပ်ဆင်ခြင်း"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.inputCategoryNameEN}
                </label>
                <input
                  type="text"
                  value={newCatForm.nameEN}
                  onChange={(e) => setNewCatForm({ ...newCatForm, nameEN: e.target.value })}
                  placeholder="e.g. Solar Power System"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.inputTargetBudget} *
                </label>
                <input
                  type="number"
                  value={newCatForm.targetBudget}
                  onChange={(e) => setNewCatForm({ ...newCatForm, targetBudget: e.target.value })}
                  placeholder="ဥပမာ - 5000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition"
                >
                  {t.addCategoryBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category Target */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
              {t.editCategoryTarget}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-bold">
              {lang === 'MY' ? editingCategory.nameMY : editingCategory.nameEN}
            </p>

            <form onSubmit={handleEditCategorySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.inputTargetBudget}
                </label>
                <input
                  type="number"
                  value={editTargetBudget}
                  onChange={(e) => setEditTargetBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition"
                >
                  {t.saveProjectBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      {deleteCatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">
              {t.confirmDeleteCategoryTitle}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              {t.confirmDeleteCategoryDesc}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteCatId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCategory(deleteCatId);
                  setDeleteCatId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition"
              >
                {lang === 'MY' ? 'ဖျက်မည်' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
