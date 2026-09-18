import { HouseManagerDocument, HousePlanBackup } from '../types/housePlanTypes';

// Format numbers in Kyats with commas
export function formatMMK(amount: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(amount || 0));
}

// Format numbers in Lakhs (သိန်း)
export function formatLakhs(amount: number, lang: 'MY' | 'EN'): string {
  const lakhs = (amount || 0) / 100000;
  const formatted = lakhs % 1 === 0 ? lakhs.toString() : lakhs.toFixed(1);
  return lang === 'MY' ? `${formatted} သိန်း` : `${formatted} Lakhs`;
}

// Export Manager Backup to JSON file
export function exportHousePlanBackup(manager: HouseManagerDocument): void {
  const backup: HousePlanBackup = {
    appName: 'HousePlanBudget',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    manager,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  const dateStr = `${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}_${String(d.getDate()).padStart(2, '0')}`;
  a.href = url;
  a.download = `houseplan_${manager.managerId}_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Parse Manager Backup JSON File
export async function parseHousePlanBackupFile(file: File): Promise<HouseManagerDocument> {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || (!data.manager && !data.project)) {
    throw new Error('Invalid House Plan backup structure');
  }
  return (data.manager || data.project) as HouseManagerDocument;
}
