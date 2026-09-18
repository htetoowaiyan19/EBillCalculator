import { BackupData, CalculationRecord, CustomNames, Language, PreviousReadings, Theme } from '../types';

const KEYS = {
  LANG: 'ebill_lang',
  THEME: 'ebill_theme',
  NAMES: 'ebill_custom_names',
  PREVIOUS: 'ebill_previous_readings',
  HISTORY: 'ebill_calc_history'
};

export function getStoredLang(): Language {
  const val = localStorage.getItem(KEYS.LANG);
  return val === 'EN' ? 'EN' : 'MY';
}

export function setStoredLang(lang: Language): void {
  localStorage.setItem(KEYS.LANG, lang);
}

export function getStoredTheme(): Theme {
  const val = localStorage.getItem(KEYS.THEME);
  return val === 'dark' ? 'dark' : 'light';
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(KEYS.THEME, theme);
}

export function getStoredNames(): CustomNames {
  try {
    const val = localStorage.getItem(KEYS.NAMES);
    return val ? JSON.parse(val) : { p1: '', p2: '', shared: '' };
  } catch {
    return { p1: '', p2: '', shared: '' };
  }
}

export function setStoredNames(names: CustomNames): void {
  localStorage.setItem(KEYS.NAMES, JSON.stringify(names));
}

export function getStoredPrevious(): PreviousReadings | null {
  try {
    const val = localStorage.getItem(KEYS.PREVIOUS);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export function setStoredPrevious(prev: PreviousReadings): void {
  localStorage.setItem(KEYS.PREVIOUS, JSON.stringify(prev));
}

export function getStoredHistory(): CalculationRecord[] {
  try {
    const val = localStorage.getItem(KEYS.HISTORY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export function saveHistoryRecord(record: CalculationRecord): CalculationRecord[] {
  const list = getStoredHistory();
  const exists = list.some(item => item.id === record.id || item.timestamp === record.timestamp);
  if (!exists) {
    list.unshift(record);
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(list));
  }
  return list;
}

export function deleteHistoryRecord(id: string): CalculationRecord[] {
  const list = getStoredHistory().filter(item => item.id !== id);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(list));
  return list;
}

export function clearAllHistory(): void {
  localStorage.removeItem(KEYS.HISTORY);
}

export function exportBackupJson(): void {
  const backup: BackupData = {
    appName: 'EBillCalculator',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    history: getStoredHistory(),
    previous: getStoredPrevious(),
    names: getStoredNames()
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  a.href = url;
  a.download = `ebill_backup_${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBackupJson(jsonStr: string): { success: true; data: BackupData } | { success: false; error: string } {
  try {
    const parsed = JSON.parse(jsonStr) as BackupData;
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Invalid JSON format' };
    }

    if (Array.isArray(parsed.history)) {
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(parsed.history));
    }
    if (parsed.previous) {
      setStoredPrevious(parsed.previous);
    }
    if (parsed.names) {
      setStoredNames(parsed.names);
    }

    return { success: true, data: parsed };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to parse JSON' };
  }
}

export function clearEBillLocalStorage(): void {
  try {
    localStorage.removeItem(KEYS.NAMES);
    localStorage.removeItem(KEYS.PREVIOUS);
    localStorage.removeItem(KEYS.HISTORY);
    localStorage.removeItem('ebill_autosave');
  } catch (err) {
    console.warn('Failed to clear EBill local storage:', err);
  }
}

