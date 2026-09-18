import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Receipt,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Language } from '../../types';
import {
  CustomCategoryTarget,
  ExpenseCategoryKey,
  ExpenseItem,
  ManagerPermissions,
  PaymentStatus,
} from '../../types/housePlanTypes';
import { housePlanTranslations } from '../../constants/housePlanTranslations';
import { formatMMK } from '../../utils/housePlanStorage';

interface HousePlanExpensesProps {
  expenses: ExpenseItem[];
  categories: CustomCategoryTarget[];
  permissions: ManagerPermissions;
  lang: Language;
  onAddExpense: (item: Omit<ExpenseItem, 'id' | 'createdAt'>) => void;
  onEditExpense: (item: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const HousePlanExpenses: React.FC<HousePlanExpensesProps> = ({
  expenses,
  categories,
  permissions,
  lang,
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
  onToggleStatus,
}) => {
  const t = housePlanTranslations[lang];

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: categories[0]?.key || 'foundation',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    payee: '',
    status: 'paid' as PaymentStatus,
    notes: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirm Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Helper for category name
  const getCategoryName = (key: string) => {
    const found = categories.find((c) => c.key === key);
    if (!found) return key;
    return lang === 'MY' ? found.nameMY : found.nameEN;
  };

  // Open modal for add
  const handleOpenAdd = () => {
    if (!permissions.canEditExpenses) return;
    setEditingItem(null);
    setFormData({
      title: '',
      category: categories[0]?.key || 'foundation',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      payee: '',
      status: 'paid',
      notes: '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEdit = (item: ExpenseItem) => {
    if (!permissions.canEditExpenses) return;
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      amount: String(item.amount),
      date: item.date,
      payee: item.payee,
      status: item.status,
      notes: item.notes || '',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  // Submit modal form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError(t.errFillRequired);
      return;
    }
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError(t.errInvalidAmount);
      return;
    }

    if (editingItem) {
      onEditExpense({
        ...editingItem,
        title: formData.title.trim(),
        category: formData.category,
        amount: parsedAmount,
        date: formData.date || new Date().toISOString().split('T')[0],
        payee: formData.payee.trim() || '—',
        status: formData.status,
        notes: formData.notes.trim() || undefined,
      });
    } else {
      onAddExpense({
        title: formData.title.trim(),
        category: formData.category,
        amount: parsedAmount,
        date: formData.date || new Date().toISOString().split('T')[0],
        payee: formData.payee.trim() || '—',
        status: formData.status,
        notes: formData.notes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.payee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const matchStatus =
        selectedStatus === 'all' || item.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [expenses, searchQuery, selectedCategory, selectedStatus]);

  const filteredTotalAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Pagination calculation
  const totalPages = Math.ceil(filteredExpenses.length / rowsPerPage) || 1;
  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredExpenses.slice(start, start + rowsPerPage);
  }, [filteredExpenses, currentPage, rowsPerPage]);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Top Header & Add Button */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-5 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-500" />
              {t.expensesTitle}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.expensesDesc}</p>
          </div>

          {permissions.canEditExpenses ? (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-95 shadow-sm shadow-amber-500/20 transition duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addExpenseBtn}</span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {t.viewerBadge}
            </span>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 outline-none transition"
            />
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition cursor-pointer truncate"
            >
              <option value="all">{t.filterCategoryAll}</option>
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {lang === 'MY' ? c.nameMY : c.nameEN}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition cursor-pointer"
            >
              <option value="all">{t.filterStatusAll}</option>
              <option value="paid">{t.statusPaid}</option>
              <option value="pending">{t.statusPending}</option>
            </select>
          </div>
        </div>

        {/* Counter and Filtered Total Summary Bar */}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] sm:text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {t.totalFilteredCount}: <strong className="text-slate-800 dark:text-slate-200">{filteredExpenses.length}</strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {t.totalFilteredAmount}:{' '}
            <strong className="text-amber-600 dark:text-amber-400 font-black">
              {formatMMK(filteredTotalAmount)} {t.currencySymbol}
            </strong>
          </span>
        </div>
      </div>

      {/* Expense List: Mobile Cards (< sm) & Desktop Table (>= sm) */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark overflow-hidden">
        {paginatedExpenses.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs sm:text-sm">
            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="font-semibold">{t.noExpensesFound}</p>
          </div>
        ) : (
          <div>
            {/* 1. Mobile Cards View (Hidden on sm and larger) */}
            <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
              {paginatedExpenses.map((item) => {
                const isPaid = item.status === 'paid';

                return (
                  <div key={item.id} className="p-3.5 space-y-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-xs text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            {getCategoryName(item.category)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {formatMMK(item.amount)}{' '}
                          <span className="text-[9px] text-slate-400">{t.currencySymbol}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium truncate max-w-[110px]">
                          {item.payee}
                        </div>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg">
                        {item.notes}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                      {/* Status Button */}
                      <button
                        type="button"
                        onClick={() => permissions.canEditExpenses && onToggleStatus(item.id)}
                        disabled={!permissions.canEditExpenses}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPaid
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        <span>{isPaid ? t.statusPaid : t.statusPending}</span>
                      </button>

                      {/* Edit / Delete Buttons */}
                      {permissions.canEditExpenses && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 text-slate-400 hover:text-amber-600 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. Desktop Table View (Hidden on mobile) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3.5">{t.tableColDate}</th>
                    <th className="py-2.5 px-3.5">{t.tableColItem}</th>
                    <th className="py-2.5 px-3.5 hidden md:table-cell">{t.tableColCategory}</th>
                    <th className="py-2.5 px-3.5">{t.tableColPayee}</th>
                    <th className="py-2.5 px-3.5 text-right">{t.tableColAmount}</th>
                    <th className="py-2.5 px-3.5 text-center">{t.tableColStatus}</th>
                    {permissions.canEditExpenses && (
                      <th className="py-2.5 px-3.5 text-right">{t.tableColActions}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {paginatedExpenses.map((item) => {
                    const isPaid = item.status === 'paid';

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-amber-500/5 dark:hover:bg-amber-500/5 transition duration-150"
                      >
                        <td className="py-2.5 px-3.5 text-slate-500 whitespace-nowrap font-medium">
                          {item.date}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="font-extrabold text-slate-900 dark:text-slate-100">
                            {item.title}
                          </div>
                          {item.notes && (
                            <div className="text-[10px] text-slate-400 truncate max-w-xs">
                              {item.notes}
                            </div>
                          )}
                          <div className="md:hidden text-[9px] text-amber-600 font-bold">
                            {getCategoryName(item.category)}
                          </div>
                        </td>
                        <td className="py-2.5 px-3.5 hidden md:table-cell">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {getCategoryName(item.category)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-300 font-medium">
                          {item.payee}
                        </td>
                        <td className="py-2.5 px-3.5 text-right whitespace-nowrap font-black text-slate-900 dark:text-white">
                          {formatMMK(item.amount)}{' '}
                          <span className="text-[9px] font-medium text-slate-400">
                            {t.currencySymbol}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => permissions.canEditExpenses && onToggleStatus(item.id)}
                            disabled={!permissions.canEditExpenses}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold transition active:scale-95 ${
                              isPaid
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {isPaid ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{isPaid ? t.statusPaid : t.statusPending}</span>
                          </button>
                        </td>
                        {permissions.canEditExpenses && (
                          <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(item)}
                                className="p-1 rounded text-slate-400 hover:text-amber-600 transition"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTargetId(item.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span>{t.rowsPerPage}:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="py-1 px-2 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Page Navigator */}
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 active:scale-95 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>
                  {t.pageLabel} {currentPage} {t.ofLabel} {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 active:scale-95 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-500" />
                {editingItem ? t.modalEditTitle : t.modalAddTitle}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-300 text-rose-600 text-xs font-bold">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.inputItemTitle} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={t.inputItemPlaceholder}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.inputCategory} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ExpenseCategoryKey })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.key} value={c.key}>
                        {lang === 'MY' ? c.nameMY : c.nameEN}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.inputAmount} *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder={t.inputAmountPlaceholder}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.inputPayee}
                  </label>
                  <input
                    type="text"
                    value={formData.payee}
                    onChange={(e) => setFormData({ ...formData, payee: e.target.value })}
                    placeholder={t.inputPayeePlaceholder}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.inputDate}
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.inputStatus}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'paid' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                      formData.status === 'paid'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.statusPaid}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'pending' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
                      formData.status === 'pending'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.statusPending}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t.inputNotes}
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t.inputNotesPlaceholder}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.saveExpenseBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">
              {t.confirmDeleteExpenseTitle}
            </h4>
            <p className="text-xs text-slate-500 mb-5">
              {t.confirmDeleteExpenseDesc}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteExpense(deleteTargetId);
                  setDeleteTargetId(null);
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
