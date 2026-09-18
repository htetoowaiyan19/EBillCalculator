import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hammer,
  CheckCircle2,
  Clock,
  Circle,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  ShieldAlert,
} from 'lucide-react';
import { Language } from '../../types';
import {
  CustomConstructionStage,
  ManagerPermissions,
  StageStatus,
} from '../../types/housePlanTypes';
import { housePlanTranslations } from '../../constants/housePlanTranslations';
import { ConfirmModal } from '../ConfirmModal';

interface HousePlanStagesProps {
  stages: CustomConstructionStage[];
  permissions: ManagerPermissions;
  lang: Language;
  onAddStage: (stage: Omit<CustomConstructionStage, 'id' | 'order'>) => void;
  onUpdateStage: (updatedStage: CustomConstructionStage) => void;
  onDeleteStage: (stageId: string) => void;
  onClearAllStages?: () => void;
  onAddTask: (stageId: string, taskTitle: string) => void;
  onToggleTask: (stageId: string, taskId: string) => void;
  onDeleteTask: (stageId: string, taskId: string) => void;
}

export const HousePlanStages: React.FC<HousePlanStagesProps> = ({
  stages,
  permissions,
  lang,
  onAddStage,
  onUpdateStage,
  onDeleteStage,
  onClearAllStages,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const t = housePlanTranslations[lang];

  // Accordion open/close state: maps stage.id -> boolean
  const [openStages, setOpenStages] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    // Open in-progress stage by default, or the first stage
    const inProg = stages.find((s) => s.status === 'in_progress');
    if (inProg) {
      initial[inProg.id] = true;
    } else if (stages.length > 0) {
      initial[stages[0].id] = true;
    }
    return initial;
  });

  // Filter stage status: 'all' | 'in_progress' | 'completed' | 'not_started'
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal: Add Custom Stage
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);
  const [newStageTitle, setNewStageTitle] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  // Inline New Task Form State: maps stage.id -> taskTitle string
  const [newTaskInput, setNewTaskInput] = useState<Record<string, string>>({});
  const [activeTaskInputStageId, setActiveTaskInputStageId] = useState<string | null>(null);

  // Delete Stage Confirm Modal
  const [deleteStageTargetId, setDeleteStageTargetId] = useState<string | null>(null);
  const [isClearAllModalOpen, setIsClearAllModalOpen] = useState(false);

  // Toggle stage accordion
  const toggleAccordion = (id: string) => {
    setOpenStages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Cycle stage status (Not Started -> In Progress -> Completed -> Not Started)
  const cycleStatus = (stage: CustomConstructionStage) => {
    if (!permissions.canEditStages) return;

    let nextStatus: StageStatus = 'in_progress';
    let nextTasks = stage.tasks;

    if (stage.status === 'not_started') {
      nextStatus = 'in_progress';
    } else if (stage.status === 'in_progress') {
      nextStatus = 'completed';
      // Mark all tasks completed
      nextTasks = stage.tasks.map((t) => ({ ...t, completed: true }));
    } else {
      nextStatus = 'not_started';
      nextTasks = stage.tasks.map((t) => ({ ...t, completed: false }));
    }

    onUpdateStage({
      ...stage,
      status: nextStatus,
      tasks: nextTasks,
    });
  };

  // Submit Add Stage
  const handleAddStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageTitle.trim()) return;

    onAddStage({
      title: newStageTitle.trim(),
      description: newStageDesc.trim() || undefined,
      status: 'not_started',
      tasks: [],
    });

    setNewStageTitle('');
    setNewStageDesc('');
    setIsAddStageOpen(false);
  };

  // Submit Inline New Task
  const handleAddTaskSubmit = (stageId: string) => {
    const title = newTaskInput[stageId]?.trim();
    if (!title) return;

    onAddTask(stageId, title);
    setNewTaskInput((prev) => ({ ...prev, [stageId]: '' }));
    setActiveTaskInputStageId(null);
  };

  // Filtered Stages
  const filteredStages = stages.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  // Calculate overall progress
  const totalTasksCount = stages.reduce((sum, s) => sum + s.tasks.length, 0);
  const completedTasksCount = stages.reduce(
    (sum, s) => sum + s.tasks.filter((t) => t.completed).length,
    0
  );
  const completedStagesCount = stages.filter((s) => s.status === 'completed').length;
  const overallPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : stages.length > 0
      ? Math.round((completedStagesCount / stages.length) * 100)
      : 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Overall Progress Banner */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 sm:p-5 border border-white/60 dark:border-slate-800/80 shadow-glass dark:shadow-glass-dark">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Hammer className="w-4 h-4 text-amber-500" />
              {t.stagesTitle}
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.stagesDesc}</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              {completedStagesCount}/{stages.length} {lang === 'MY' ? 'ပြီးစီး' : 'Done'}
            </span>

            {permissions.canEditStages ? (
              <div className="flex items-center gap-1.5">
                {stages.length > 0 && onClearAllStages && (
                  <button
                    type="button"
                    onClick={() => setIsClearAllModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 transition"
                    title={lang === 'MY' ? 'အဆင့်များအားလုံး ဖျက်မည်' : 'Clear all stages'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {lang === 'MY' ? 'အကုန်ဖျက်မည်' : 'Clear All'}
                    </span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsAddStageOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 active:scale-95 transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addStageBtn}</span>
                </button>
              </div>
            ) : (
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {t.viewerBadge}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
            <span>{t.overallProgress}</span>
            <span className="text-amber-600 dark:text-amber-400">{overallPercentage}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar (Prevents Vertical Stacking on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
        <button
          type="button"
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterStatus === 'all'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          {t.filterAllStages} ({stages.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('in_progress')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterStatus === 'in_progress'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          {t.filterInProgress} ({stages.filter((s) => s.status === 'in_progress').length})
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('completed')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterStatus === 'completed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          {t.filterCompleted} ({stages.filter((s) => s.status === 'completed').length})
        </button>

        <button
          type="button"
          onClick={() => setFilterStatus('not_started')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            filterStatus === 'not_started'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60'
          }`}
        >
          {t.filterNotStarted} ({stages.filter((s) => s.status === 'not_started').length})
        </button>
      </div>

      {/* Collapsible Accordion Stages List */}
      <div className="space-y-2.5">
        {filteredStages.map((stage, idx) => {
          const isCompleted = stage.status === 'completed';
          const isInProgress = stage.status === 'in_progress';
          const isOpen = openStages[stage.id] ?? false;

          const stageCompletedTasks = stage.tasks.filter((t) => t.completed).length;

          return (
            <div
              key={stage.id}
              className={`backdrop-blur-xl rounded-2xl border transition-all duration-200 overflow-hidden ${
                isCompleted
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-300/60 dark:border-emerald-800/60'
                  : isInProgress
                  ? 'bg-amber-500/5 dark:bg-amber-950/20 border-amber-300/60 dark:border-amber-800/60'
                  : 'bg-white/80 dark:bg-slate-900/80 border-white/60 dark:border-slate-800/80'
              }`}
            >
              {/* Accordion Bar / Header */}
              <div className="p-3.5 flex items-center justify-between gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => toggleAccordion(stage.id)}
                  className="flex items-center gap-2.5 flex-1 min-w-0"
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : isInProgress
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                      {stage.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>
                        {stageCompletedTasks}/{stage.tasks.length} {lang === 'MY' ? 'အလုပ်ပြီး' : 'tasks'}
                      </span>
                      {stage.description && (
                        <span className="hidden sm:inline truncate max-w-xs">
                          • {stage.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Status Toggle & Expand Chevron */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => cycleStatus(stage)}
                    disabled={!permissions.canEditStages}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition active:scale-95 border ${
                      isCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                        : isInProgress
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                    }`}
                    title="Click to toggle status"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : isInProgress ? (
                      <Clock className="w-3 h-3" />
                    ) : (
                      <Circle className="w-3 h-3" />
                    )}
                    <span className="hidden xs:inline">
                      {isCompleted
                        ? t.stageStatusCompleted
                        : isInProgress
                        ? t.stageStatusInProgress
                        : t.stageStatusNotStarted}
                    </span>
                  </button>

                  {/* Delete Stage Button (Custom Stages or if permitted) */}
                  {permissions.canEditStages && (
                    <button
                      type="button"
                      onClick={() => setDeleteStageTargetId(stage.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                      title={t.deleteStage}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Accordion Expand/Collapse Button */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(stage.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Accordion Body: Checklist & Add Task */}
              {isOpen && (
                <div className="px-3.5 pb-3.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {stage.tasks.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-1">
                      {lang === 'MY' ? 'အလုပ်စစ်ဆေးချက် မရှိသေးပါ' : 'No tasks added yet'}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {stage.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition group"
                        >
                          <label className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer text-xs select-none">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => permissions.canEditStages && onToggleTask(stage.id, task.id)}
                              disabled={!permissions.canEditStages}
                              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                            />
                            <span
                              className={`truncate ${
                                task.completed
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-800 dark:text-slate-200 font-medium'
                              }`}
                            >
                              {task.title}
                            </span>
                          </label>

                          {permissions.canEditStages && (
                            <button
                              type="button"
                              onClick={() => onDeleteTask(stage.id, task.id)}
                              className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition"
                              title={t.deleteTask}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Checkmark Task Inline Form */}
                  {permissions.canEditStages && (
                    <div className="pt-2">
                      {activeTaskInputStageId === stage.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={newTaskInput[stage.id] || ''}
                            onChange={(e) =>
                              setNewTaskInput({ ...newTaskInput, [stage.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTaskSubmit(stage.id);
                              }
                            }}
                            placeholder={t.inputTaskPlaceholder}
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTaskSubmit(stage.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition"
                          >
                            {lang === 'MY' ? 'ထည့်မည်' : 'Add'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTaskInputStageId(null)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setActiveTaskInputStageId(stage.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{t.addTaskBtn}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredStages.length === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 shadow-glass dark:shadow-glass-dark">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Hammer className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">
              {lang === 'MY' ? 'ဆောက်လုပ်ရေး အဆင့်များ မရှိသေးပါ' : 'No Construction Stages Yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              {lang === 'MY'
                ? 'သင်၏ စိတ်ကြိုက် ဆောက်လုပ်ရေး အဆင့်များနှင့် လုပ်ငန်းစစ်ဆေးချက်များကို ထည့်သွင်းနိုင်ပါသည်'
                : 'Add your custom construction milestones, phases, and task checklists.'}
            </p>
            {permissions.canEditStages && (
              <button
                type="button"
                onClick={() => setIsAddStageOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 active:scale-95 transition shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addStageBtn}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add Custom Stage with Framer Motion */}
      <AnimatePresence>
        {isAddStageOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsAddStageOpen(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-amber-500" />
                  {t.modalAddStageTitle}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddStageOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStageSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t.inputStageTitle} *
                  </label>
                  <input
                    type="text"
                    value={newStageTitle}
                    onChange={(e) => setNewStageTitle(e.target.value)}
                    placeholder="ဥပမာ - ဆိုလာပြားများ တပ်ဆင်ခြင်း"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'MY' ? 'အဆင့် ရှင်းလင်းချက် (ရွေးချယ်ရန်)' : 'Description (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newStageDesc}
                    onChange={(e) => setNewStageDesc(e.target.value)}
                    placeholder="ဥပမာ - အင်ဗာတာနှင့် ဘက်ထရီချိတ်ဆက်မှုများ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddStageOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition"
                  >
                    {t.addStageBtn}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Stage Confirm Dialog with Framer Motion */}
      <AnimatePresence>
        {deleteStageTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setDeleteStageTargetId(null)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 360 }}
              className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xl"
            >
              <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">
                {t.confirmDeleteStageTitle}
              </h4>
              <p className="text-xs text-slate-500 mb-5">
                {t.confirmDeleteStageDesc}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeleteStageTargetId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteStage(deleteStageTargetId);
                    setDeleteStageTargetId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition"
                >
                  {lang === 'MY' ? 'ဖျက်မည်' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Confirm Modal for Clearing All Stages */}
      <ConfirmModal
        isOpen={isClearAllModalOpen}
        message={
          lang === 'MY'
            ? 'ဆောက်လုပ်ရေးအဆင့်များ အားလုံးကို ဖျက်ပစ်ရန် သေချာပါသလား?'
            : 'Are you sure you want to remove all construction stages?'
        }
        lang={lang}
        onConfirm={() => {
          onClearAllStages?.();
          setIsClearAllModalOpen(false);
        }}
        onCancel={() => setIsClearAllModalOpen(false)}
      />
    </div>
  );
};
