import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  CheckCircle2,
  Home,
  Smartphone,
  Layers,
  Sparkle,
  ArrowRight,
  Globe,
} from 'lucide-react';
import { Language } from '../types';

interface VersionUpdateModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onToggleLang?: () => void;
}

export const CURRENT_VERSION = 'v1.4.1';

export const VersionUpdateModal: React.FC<VersionUpdateModalProps> = ({
  isOpen,
  lang,
  onClose,
  onToggleLang,
}) => {
  const patchNotes = [
    {
      icon: <Globe className="w-5 h-5 text-emerald-500" />,
      bg: 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/80',
      title: lang === 'MY' ? '🌐 Vercel SPA Routing & Refresh Fix' : '🌐 Vercel SPA Routing & Direct Link Support',
      desc:
        lang === 'MY'
          ? 'Vercel ပေါ်တွင် တင်ထားစဉ် /houseplan နှင့် /ebillcalculator စာမျက်နှာများကို Refresh ပြုလုပ်ရာတွင် 404 Error မတက်စေရန် vercel.json rewrite config ထည့်သွင်းပေးထားခြင်း။'
          : 'Added vercel.json SPA rewrites ensuring direct navigation and page reloads on /houseplan and /ebillcalculator routes work seamlessly without 404 errors.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-500/10 border-blue-200 dark:border-blue-800/80',
      title: lang === 'MY' ? '🔑 Register Modal တွင် Google ဖြင့် အကောင့်ဖွင့်နိုင်ခြင်း' : '🔑 1-Tap Google Sign-Up in Register Modal',
      desc:
        lang === 'MY'
          ? 'အကောင့်အသစ်ဖွင့် (Register) မော်ဒယ်တွင် Google ဖြင့် 1-tap အလွယ်တကူ အကောင့်ဖွင့်နိုင်မည့် ခလုတ်အသစ် ထည့်သွင်းပေးထားခြင်း။'
          : 'Added 1-tap Google sign-up button inside the registration form for instant, hassle-free account creation.',
    },
    {
      icon: <Home className="w-5 h-5 text-amber-500" />,
      bg: 'bg-amber-500/10 border-amber-200 dark:border-amber-800/80',
      title: lang === 'MY' ? '🏡 အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှုစနစ် (House Plan Manager)' : '🏡 House Budget Manager Integration',
      desc:
        lang === 'MY'
          ? 'အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှုစနစ် အသစ်ထည့်သွင်းခြင်း။ Firestore Cloud ချိတ်ဆက်မှု၊ ၈ လုံးပါ Manager ID ဖြင့် မိသားစုဝင်များ/လက်သမားများနှင့် အချိန်နှင့်တပြေးညီ တိုက်ရိုက်ချိတ်ဆက်အသုံးပြုနိုင်ခြင်း။'
          : 'New House Budget Manager miniapp (/houseplan). Real-time Firestore cloud synchronization with 8-Digit Manager ID access for co-builders and family members.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-500/10 border-blue-200 dark:border-blue-800/80',
      title: lang === 'MY' ? '📱 အောက်ခြေ Navigation Bar (Mobile-First Ergonomics)' : '📱 Thumb-Friendly Bottom Navigation Bar',
      desc:
        lang === 'MY'
          ? 'ဖုန်းဖြင့် သုံးစွဲရာတွင် လက်မဖြင့် အလွယ်တကူ နှိပ်နိုင်သည့် Frosted Glass အောက်ခြေ Nav Bar။ Calculator, History, Backup, Overview, Expenses, Stages အစရှိသည်တို့ကို အဆင်ပြေစွာ ကူးပြောင်းနိုင်ခြင်း။'
          : 'Thumb-friendly frosted glass bottom navigation bar for quick 1-tap switching between Calculator, History, Backup, Expenses, and Construction Stages.',
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      bg: 'bg-indigo-500/10 border-indigo-200 dark:border-indigo-800/80',
      title: lang === 'MY' ? '⚡ ရှုပ်ထွေးသော Nested ဘောင်များ ရှင်းထုတ်ခြင်း' : '⚡ Streamlined Input Cards (No Clutter)',
      desc:
        lang === 'MY'
          ? 'ရှုပ်ထွေးနေသော အဆင့်ဆင့်ဘောင်များ (Overlapped rounded boxes) ကို ရှင်းထုတ်ပြီး ဖတ်ရလွယ်ကူ သန့်ရှင်းသော input rows များဖြင့် အစားထိုးပြင်ဆင်ခြင်း။'
          : 'Eliminated cluttered nested rounded cards. Replaced with clean, direct, thumb-friendly input fields and live difference badges.',
    },
    {
      icon: <Sparkle className="w-5 h-5 text-rose-500" />,
      bg: 'bg-rose-500/10 border-rose-200 dark:border-rose-800/80',
      title: lang === 'MY' ? '🎯 မူလသတ်မှတ်တန်ဖိုးများ ဖယ်ရှားခြင်း (Clean Inputs)' : '🎯 100% Custom Inputs (No Default Values)',
      desc:
        lang === 'MY'
          ? 'မူလသတ်မှတ်တန်ဖိုးများ (Default Values) အားလုံးကို ဖယ်ရှားပြီး မိမိအလိုရှိသော ကိန်းဂဏန်းများကို တိုက်ရိုက်တိကျစွာ ရိုက်ထည့်နိုင်ရန် ပြင်ဆင်ခြင်း။'
          : 'Removed all hardcoded default values across the calculator and house budget manager for 100% custom and precise input data.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      bg: 'bg-purple-500/10 border-purple-200 dark:border-purple-800/80',
      title: lang === 'MY' ? '✨ Fluid Framer Motion UI Animations' : '✨ Fluid Framer Motion Animations',
      desc:
        lang === 'MY'
          ? 'Framer Motion နည်းပညာဖြင့် ဖန်တီးထားသော အလွန်ချောမွေ့သည့် Gliding Tab Indicator Pill၊ Modal Popups၊ Spring Micro-interactions နှင့် Page Transitions များ။'
          : 'Silky-smooth fluid spring animations, sliding active tab pill, spring modal popups, and fluid page transitions powered by Framer Motion.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print font-burmese">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Card with subtle spring scale & slide */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            className="relative z-10 backdrop-blur-2xl bg-white/95 dark:bg-slate-900/95 w-full max-w-lg rounded-3xl border border-white/60 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header with Gradient Ribbon */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 pb-5 overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black border border-white/30 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>{CURRENT_VERSION} Update</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight">
                    {lang === 'MY' ? 'ဗားရှင်း ၁.၄.၁ အသစ်ထွက်ရှိမှု မှတ်စုများ' : "What's New in Version 1.4.1"}
                  </h3>
                  <p className="text-xs text-blue-100 font-medium">
                    {lang === 'MY'
                      ? 'ပိုမိုကောင်းမွန်၊ လျင်မြန်ပြီး ချောမွေ့သော လုပ်ဆောင်ချက်အသစ်များကို လေ့လာပါ'
                      : 'Explore the latest features and fluid quality of life improvements'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {onToggleLang && (
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={onToggleLang}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:bg-white/30 text-white backdrop-blur-md transition text-xs font-black border border-white/20 shadow-sm"
                      title={lang === 'MY' ? 'Switch to English' : 'မြန်မာဘာသာသို့ ပြောင်းရန်'}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>{lang === 'MY' ? 'EN' : 'မြန်မာ'}</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
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

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition"
              >
                <span>{lang === 'MY' ? 'စတင်အသုံးပြုမည်' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
