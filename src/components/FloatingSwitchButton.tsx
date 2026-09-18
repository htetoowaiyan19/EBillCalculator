import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Zap, ArrowLeftRight } from 'lucide-react';
import { Language } from '../types';

interface FloatingSwitchButtonProps {
  currentRoute: '/ebillcalculator' | '/houseplan';
  lang: Language;
  onNavigate: (route: '/ebillcalculator' | '/houseplan') => void;
  hasBottomNav?: boolean;
}

export const FloatingSwitchButton: React.FC<FloatingSwitchButtonProps> = ({
  currentRoute,
  lang,
  onNavigate,
  hasBottomNav = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const isEbill = currentRoute === '/ebillcalculator';
  const targetRoute = isEbill ? '/houseplan' : '/ebillcalculator';

  const label = isEbill
    ? (lang === 'MY' ? 'အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှု' : 'House Plan Budget')
    : (lang === 'MY' ? 'မီတာခ ခွဲဝေတွက်ချက်စက်' : 'E-Bill Calculator');

  const accessibilityLabel = isEbill
    ? (lang === 'MY' ? 'အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှုသို့ သွားမည်' : 'Switch to House Plan Budget')
    : (lang === 'MY' ? 'မီတာခ ခွဲဝေတွက်ချက်စက်သို့ သွားမည်' : 'Switch to E-Bill Calculator');

  return (
    <aside
      aria-label="Miniapp Switcher"
      className={`fixed right-4 sm:right-6 z-40 flex items-center gap-2.5 no-print transition-all duration-300 ease-out ${
        hasBottomNav ? 'bottom-20 sm:bottom-22' : 'bottom-4 sm:bottom-6'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => {
        setTimeout(() => setIsHovered(false), 2200);
      }}
    >
      {/* Floating Pill Label - ONLY displayed when cursor or touch is over the page switch button */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.92 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={() => onNavigate(targetRoute)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer backdrop-blur-xl select-none shadow-xl flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs sm:text-sm font-black whitespace-nowrap ${
              isEbill
                ? 'bg-slate-900/90 dark:bg-slate-800/90 text-amber-300 border-amber-500/30 shadow-amber-500/15'
                : 'bg-slate-900/90 dark:bg-slate-800/90 text-blue-300 border-blue-500/30 shadow-blue-500/15'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
            <span>{label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Floating Switch Button with Spring Tactile Bounce */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={() => onNavigate(targetRoute)}
        aria-label={accessibilityLabel}
        className={`relative group w-14 h-14 sm:w-15 sm:h-15 rounded-full flex items-center justify-center text-white shadow-2xl focus:outline-none ${
          isEbill
            ? 'bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 hover:from-amber-500 hover:to-orange-400 shadow-orange-600/35'
            : 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 hover:from-blue-600 hover:to-cyan-400 shadow-blue-600/35'
        }`}
      >
        {/* Subtle Ambient Ring Glow on Hover */}
        <span
          className={`absolute -inset-0.5 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300 ${
            isEbill ? 'bg-orange-500' : 'bg-cyan-500'
          }`}
        />

        {/* Inner Circle and Icon with AnimatePresence */}
        <span className="relative z-10 flex items-center justify-center w-full h-full rounded-full border border-white/40">
          <AnimatePresence mode="wait">
            {isEbill ? (
              <motion.div
                key="ebill-icon"
                initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 45, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
              >
                <Home className="w-7 h-7 text-white drop-shadow-md" />
              </motion.div>
            ) : (
              <motion.div
                key="house-icon"
                initial={{ rotate: -45, opacity: 0, scale: 0.8 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 45, opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
              >
                <Zap className="w-7 h-7 text-white drop-shadow-md fill-current" />
              </motion.div>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </aside>
  );
};
