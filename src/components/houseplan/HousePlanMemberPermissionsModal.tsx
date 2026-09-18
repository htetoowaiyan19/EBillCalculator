import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Users,
  Copy,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Save,
} from 'lucide-react';
import { Language } from '../../types';
import {
  HouseManagerDocument,
  ManagerMember,
  ManagerRole,
} from '../../types/housePlanTypes';
import { housePlanTranslations } from '../../constants/housePlanTranslations';

interface HousePlanMemberPermissionsModalProps {
  isOpen: boolean;
  manager: HouseManagerDocument;
  currentUserUid: string;
  lang: Language;
  onClose: () => void;
  onUpdateMembers: (members: ManagerMember[]) => void;
  onShowToast: (message: string, type?: 'success' | 'warning') => void;
}

export const HousePlanMemberPermissionsModal: React.FC<HousePlanMemberPermissionsModalProps> = ({
  isOpen,
  manager,
  currentUserUid,
  lang,
  onClose,
  onUpdateMembers,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const t = housePlanTranslations[lang];
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [membersState, setMembersState] = useState<ManagerMember[]>(manager.members || []);

  const isCreator = manager.creatorUid === currentUserUid;

  const handleCopyId = () => {
    navigator.clipboard.writeText(manager.managerId);
    setCopied(true);
    onShowToast(t.copiedManagerId, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleChange = (memberUid: string, newRole: ManagerRole) => {
    if (!isCreator) return;
    setMembersState((prev) =>
      prev.map((m) => {
        if (m.uid === memberUid) {
          const isAdm = newRole === 'admin';
          const isVwr = newRole === 'viewer';
          return {
            ...m,
            role: newRole,
            permissions: {
              canEditExpenses: !isVwr,
              canEditStages: !isVwr,
              canEditCategories: isAdm,
              canManageUsers: isAdm,
            },
          };
        }
        return m;
      })
    );
  };

  const handleTogglePermission = (
    memberUid: string,
    field: 'canEditExpenses' | 'canEditStages' | 'canEditCategories'
  ) => {
    if (!isCreator) return;
    setMembersState((prev) =>
      prev.map((m) => {
        if (m.uid === memberUid) {
          return {
            ...m,
            permissions: {
              ...m.permissions,
              [field]: !m.permissions[field],
            },
          };
        }
        return m;
      })
    );
  };

  const handleSave = () => {
    onUpdateMembers(membersState);
    onShowToast(lang === 'MY' ? 'ခွင့်ပြုချက်များ သိမ်းဆည်းပြီးပါပြီ' : 'Permissions saved successfully', 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                {t.membersTitle}
              </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-1 flex-1">
          {/* Manager Access Info Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-300/60 dark:border-amber-800/60">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                {t.managerIdBadge}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white dark:bg-slate-800 text-amber-600 border border-amber-300 dark:border-amber-700 shadow-sm active:scale-95 transition"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? (lang === 'MY' ? 'ကူးပြီး' : 'Copied') : t.copyManagerId}</span>
              </button>
            </div>

            <div className="text-xl sm:text-2xl font-mono font-black tracking-widest text-slate-900 dark:text-white">
              {manager.managerId}
            </div>

            {/* Shared Password Display */}
            <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.inputManagerPassword}:</span>
                <strong className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                  {showPassword ? manager.password : '••••••••'}
                </strong>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>{lang === 'MY' ? 'ချိတ်ဆက်ထားသော အဖွဲ့ဝင်များ' : 'Connected Members'} ({membersState.length})</span>
              {isCreator && (
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold uppercase">
                  {lang === 'MY' ? 'သင်သည် စီမံခန့်ခွဲသူဖြစ်သည်' : 'You are Admin'}
                </span>
              )}
            </div>

            {membersState.map((member) => {
              const isSelf = member.uid === currentUserUid;
              const isMemberCreator = member.uid === manager.creatorUid;

              return (
                <div
                  key={member.uid}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{member.displayName || 'Member'}</span>
                        {isSelf && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 font-bold">
                            {lang === 'MY' ? 'သင်' : 'You'}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                        {member.email}
                      </div>
                    </div>

                    {/* Role Selector or Badge */}
                    {isCreator && !isMemberCreator ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(member.uid, e.target.value as ManagerRole)
                        }
                        className="py-1 px-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
                      >
                        <option value="admin">{t.roleAdmin}</option>
                        <option value="editor">{t.roleEditor}</option>
                        <option value="viewer">{t.roleViewer}</option>
                      </select>
                    ) : (
                      <span
                        className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                          member.role === 'admin'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                            : member.role === 'editor'
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {member.role === 'admin'
                          ? t.roleAdmin
                          : member.role === 'editor'
                          ? t.roleEditor
                          : t.roleViewer}
                      </span>
                    )}
                  </div>

                  {/* Granular Permission Toggles (Admin only) */}
                  {isCreator && !isMemberCreator && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={member.permissions?.canEditExpenses ?? true}
                          onChange={() => handleTogglePermission(member.uid, 'canEditExpenses')}
                          className="w-3.5 h-3.5 rounded text-amber-600"
                        />
                        <span className="text-slate-600 dark:text-slate-400">{t.permExpenses}</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={member.permissions?.canEditStages ?? true}
                          onChange={() => handleTogglePermission(member.uid, 'canEditStages')}
                          className="w-3.5 h-3.5 rounded text-amber-600"
                        />
                        <span className="text-slate-600 dark:text-slate-400">{t.permStages}</span>
                      </label>

                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={member.permissions?.canEditCategories ?? false}
                          onChange={() => handleTogglePermission(member.uid, 'canEditCategories')}
                          className="w-3.5 h-3.5 rounded text-amber-600"
                        />
                        <span className="text-slate-600 dark:text-slate-400">{t.permCategories}</span>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t.cancelBtn}
          </button>
          {isCreator && (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 active:scale-95 transition shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveProjectBtn}</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
};
