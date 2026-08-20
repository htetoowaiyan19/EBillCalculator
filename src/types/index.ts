export type Language = 'MY' | 'EN';
export type Theme = 'light' | 'dark';
export type ActiveTab = 'calc' | 'history' | 'backup';

export interface CustomNames {
  p1: string;
  p2: string;
  shared: string;
}

export interface MeterInputs {
  p1Current: string;
  p2Current: string;
  sharedCurrent: string;
  p1Prev: string;
  p2Prev: string;
  sharedPrev: string;
  totalBill: string;
  sharedUsers: string;
}

export interface CalculationRecord {
  id: string;
  dateStr: string;
  timestamp: number;
  p1Name: string;
  p2Name: string;
  sharedName: string;
  p1Current: number;
  p2Current: number;
  sharedCurrent: number;
  p1Prev: number;
  p2Prev: number;
  sharedPrev: number;
  dP1: number;
  dP2: number;
  dShared: number;
  totalUnits: number;
  totalBill: number;
  ratePerUnit: number;
  costP1: number;
  costP2: number;
  costShared: number;
  sharedUsers: number;
  sharedPerUser: number;
  finalP1: number;
  finalP2: number;
}

export interface PreviousReadings {
  p1?: number;
  p2?: number;
  shared?: number;
}

export interface BackupData {
  appName: string;
  version: string;
  exportedAt: string;
  history: CalculationRecord[];
  previous: PreviousReadings | null;
  names: CustomNames;
}
