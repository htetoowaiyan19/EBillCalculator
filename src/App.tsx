import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, Theme } from './types';
import {
  getStoredLang,
  getStoredTheme,
  setStoredLang,
  setStoredTheme,
} from './utils/storage';
import { EBillCalculatorApp } from './components/EBillCalculatorApp';
import { HousePlanApp } from './components/houseplan/HousePlanApp';
import { FloatingSwitchButton } from './components/FloatingSwitchButton';

type AppRoute = '/ebillcalculator' | '/houseplan';

function getInitialRoute(): AppRoute {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/houseplan')) {
      return '/houseplan';
    }
  }
  return '/ebillcalculator';
}

export const App: React.FC = () => {
  // Routing state
  const [route, setRoute] = useState<AppRoute>(() => getInitialRoute());

  // Shared application states
  const [lang, setLang] = useState<Language>(() => getStoredLang());
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  // Track whether HousePlan currently has an active manager (and thus bottom nav bar)
  const [isHousePlanNavPresent, setIsHousePlanNavPresent] = useState(false);

  // Synchronize Theme with Document Element Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStoredTheme(theme);
  }, [theme]);

  // Synchronize Language Storage
  useEffect(() => {
    setStoredLang(lang);
  }, [lang]);

  // Normalize root URL if landing directly on /
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      if (path === '/' || path === '') {
        window.history.replaceState(null, '', '/ebillcalculator');
      }
    }
  }, []);

  // Handle browser popstate (Back/Forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.startsWith('/houseplan')) {
        setRoute('/houseplan');
      } else {
        setRoute('/ebillcalculator');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Programmatic navigation between miniapps
  const navigateRoute = (newRoute: AppRoute) => {
    if (newRoute !== route) {
      window.history.pushState(null, '', newRoute);
      setRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle Language handler
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'MY' ? 'EN' : 'MY'));
  };

  // Toggle Theme handler
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Determine if a bottom navigation bar is currently present on screen
  const hasBottomNav = route === '/ebillcalculator' || isHousePlanNavPresent;

  return (
    <div className="relative min-h-screen">
      {/* Ambient background lighting glow orbs */}
      <div className="ambient-glow no-print" aria-hidden="true">
        <div className="orb-1" />
        <div className="orb-2" />
      </div>

      {/* Main Routed Miniapp View with Fluid Page Transition */}
      <AnimatePresence mode="wait">
        {route === '/houseplan' ? (
          <motion.div
            key="houseplan-route"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
          >
            <HousePlanApp
              lang={lang}
              theme={theme}
              onToggleLang={handleToggleLang}
              onToggleTheme={handleToggleTheme}
              onNavigateRoute={navigateRoute}
              onBottomNavPresenceChange={setIsHousePlanNavPresent}
            />
          </motion.div>
        ) : (
          <motion.div
            key="ebill-route"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
          >
            <EBillCalculatorApp
              lang={lang}
              theme={theme}
              onToggleLang={handleToggleLang}
              onToggleTheme={handleToggleTheme}
              onNavigateRoute={navigateRoute}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Floating Switch Button (Bottom-Right Corner)
          Smoothly drops down to bottom when no footer nav bar is present */}
      <FloatingSwitchButton
        currentRoute={route}
        lang={lang}
        onNavigate={navigateRoute}
        hasBottomNav={hasBottomNav}
      />
    </div>
  );
};
