export type ExpenseCategoryKey =
  | 'foundation'
  | 'structure'
  | 'roofing'
  | 'mep'
  | 'flooring'
  | 'openings'
  | 'finishing'
  | 'labor'
  | 'misc'
  | string; // Allow custom category keys

export type PaymentStatus = 'paid' | 'pending';

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategoryKey;
  amount: number; // In MMK
  date: string; // YYYY-MM-DD
  payee: string; // Supplier / Contractor / Artisan
  status: PaymentStatus;
  notes?: string;
  createdAt: number;
}

export type StageStatus = 'not_started' | 'in_progress' | 'completed';

export interface CustomTaskCheckmark {
  id: string;
  title: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: number;
}

export interface CustomConstructionStage {
  id: string;
  stageKey?: string;
  title: string;
  description?: string;
  status: StageStatus;
  order: number;
  tasks: CustomTaskCheckmark[];
}

export interface CustomCategoryTarget {
  id: string;
  key: string;
  nameMY: string;
  nameEN: string;
  targetBudget: number; // Estimated target in MMK
  isCustom?: boolean;
}

export type ManagerRole = 'admin' | 'editor' | 'viewer';

export interface ManagerPermissions {
  canEditExpenses: boolean;
  canEditStages: boolean;
  canEditCategories: boolean;
  canManageUsers: boolean;
}

export interface ManagerMember {
  uid: string;
  email: string;
  displayName: string;
  role: ManagerRole;
  joinedAt: number;
  permissions: ManagerPermissions;
}

export interface HouseManagerDocument {
  managerId: string; // 8-digit numeric string e.g. "83921045"
  name: string; // Project title
  location: string;
  password: string; // Shared access password
  creatorUid: string;
  creatorEmail: string;
  createdAt: number;
  updatedAt: number;
  startDate: string;
  targetCompletionDate: string;
  notes?: string;
  members: ManagerMember[];
  categories: CustomCategoryTarget[];
  expenses: ExpenseItem[];
  stages: CustomConstructionStage[];
}

export type HousePlanTab = 'overview' | 'expenses' | 'stages' | 'data';

export interface HousePlanBackup {
  appName: 'HousePlanBudget';
  version: '2.0';
  exportedAt: string;
  manager: HouseManagerDocument;
}

// Backward-compatible aliases
export type ConstructionStage = CustomConstructionStage;
export type HouseProject = HouseManagerDocument;
