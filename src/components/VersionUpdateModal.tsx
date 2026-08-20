import React from 'react';
import { X, Sparkles, CheckCircle2, Cloud, CheckSquare, Palette, ArrowRight, MessageSquare } from 'lucide-react';
import { Language } from '../types';

interface VersionUpdateModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

export const CURRENT_VERSION = 'v1.3.0';

export const VersionUpdateModal: React.FC<VersionUpdateModalProps> = ({
  isOpen,
  lang,
  onClose,
}) => {
  if (!isOpen) return null;

  const patchNotes = [
    {
      icon: <Cloud className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-500/10 border-blue-200 dark:border-blue-800',
      title: lang === 'MY' ? '☁️ Cloud & Local Storage Hybrid Sync' : '☁️ Cloud & Local Storage Hybrid',
      desc:
        lang === 'MY'
          ? 'အကောင့်မဝင်ထားပါက ဖုန်းတွင်း Local Storage ဖြင့် ၁၀၀% အခမဲ့ အသုံးပြုနိုင်ပြီး၊ Google/Email ဖြင့် အကောင့်ဝင်ပါက မည်သည့်ဖုန်းမှမဆို Cloud ဖြင့် မီတာမှတ်တမ်းဟောင်းများကို ကြည့်ရှုနိုင်ပါသည်။'
          : 'Use 100% offline with local storage, or sign in with Google/Email to automatically sync records across all your devices via Firebase Cloud.',
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800',
      title: lang === 'MY' ? '☑️ အလိုအလျောက် မှတ်တမ်းသိမ်းစနစ် (Auto-Save)' : '☑️ Auto-Save to History (QoL)',
      desc:
        lang === 'MY'
          ? 'ခလုတ်ထပ်နှိပ်စရာမလိုဘဲ တွက်ချက်သည်နှင့် မှတ်တမ်းထဲ အလိုအလျောက် သိမ်းဆည်းပေးသည့် QoL စနစ် ထည့်သွင်းထားပါသည်။'
          : 'Automatically saves calculations to history upon clicking Calculate, removing the need for extra manual clicks.',
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-purple-500" />,
      bg: 'bg-purple-500/10 border-purple-200 dark:border-purple-800',
      title: lang === 'MY' ? '📱 ၁ ချက်နှိပ် Viber / SMS စာတိုကူးယူခြင်း' : '📱 1-Tap Viber / SMS Sharing',
      desc:
        lang === 'MY'
          ? 'တွက်ချက်ပြီးပါက Viber သို့မဟုတ် SMS တွင် အလွယ်တကူ Paste လုပ်ပြီး ပို့နိုင်သည့် စာရင်းရှင်းတမ်း အလိုအလျောက် ထုတ်ပေးခြင်း။'
          : 'Generates a clean breakdown message formatted and ready to paste into Viber or SMS for shared neighbours with 1 tap.',
    },
    {
      icon: <Palette className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-500/10 border-indigo-200 dark:border-indigo-800',
      title: lang === 'MY' ? '✨ Glassmorphic & Neumorphic UI ဒီဇိုင်းသစ်' : '✨ Modern Glassmorphic & Neumorphic UI',
      desc:
        lang === 'MY'
          ? 'Pyidaungsu & Padauk ဖောင့်၊ ပိုမိုလှပရှင်းလင်းသော ကတ်ပြားဒီဇိုင်း၊ အလင်းအမှောင်အလိုက် လိုက်ဖက်သော Dark/Light Mode။'
          : 'Redesigned with frosted glass cards, Padauk & Pyidaungsu typography, ambient lighting, and tactile micro-animations.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 w-full max-w-lg rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 font-burmese">
        {/* Header with Gradient Ribbon */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 pb-5 overflow-hidden">
          {/* Decorative ambient blur */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black border border-white/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>{CURRENT_VERSION} Update</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                {lang === 'MY' ? 'အသစ်ထွက်ရှိသော ဗားရှင်းမှတ်စုများ' : "What's New in E-Bill Calculator"}
              </h3>
              <p className="text-xs text-blue-100 font-medium">
                {lang === 'MY'
                  ? 'ပိုမိုကောင်းမွန် လျင်မြန်သော လုပ်ဆောင်ချက်အသစ်များကို လေ့လာပါ'
                  : 'Explore the latest features and quality of life improvements'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Patch Notes Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5">
          {patchNotes.map((note, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${note.bg} transition-all duration-200 hover:shadow-md flex items-start gap-3.5`}
            >
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex-shrink-0">
                {note.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {note.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {note.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready to use</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 active:scale-[0.98] transition"
          >
            <span>{lang === 'MY' ? 'စတင်အသုံးပြုမည်' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
