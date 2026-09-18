import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
  query,
  collection,
  where,
  getDocs,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';
import {
  CustomCategoryTarget,
  CustomConstructionStage,
  HouseManagerDocument,
  ManagerMember,
} from '../types/housePlanTypes';

const RECENT_MANAGERS_KEY = 'houseplan_recent_manager_ids';
const ACTIVE_MANAGER_KEY = 'houseplan_active_manager_id';

export const DEFAULT_INITIAL_CATEGORIES: CustomCategoryTarget[] = [
  { id: 'cat_1', key: 'foundation', nameMY: 'ဖောင်ဒေးရှင်းနှင့် မြေသားလုပ်ငန်း', nameEN: 'Foundation & Earthwork', targetBudget: 0 },
  { id: 'cat_2', key: 'structure', nameMY: 'ကိုယ်ထည်နှင့် ကွန်ကရစ်လောင်းခြင်း', nameEN: 'Structure & Concreting', targetBudget: 0 },
  { id: 'cat_3', key: 'roofing', nameMY: 'အမိုးနှင့် မျက်နှာကျက်လုပ်ငန်း', nameEN: 'Roofing & Ceiling', targetBudget: 0 },
  { id: 'cat_4', key: 'mep', nameMY: 'မီးနှင့် ရေပိုက်လိုင်း (MEP)', nameEN: 'Plumbing & Electrical (MEP)', targetBudget: 0 },
  { id: 'cat_5', key: 'flooring', nameMY: 'ကြမ်းခင်းနှင့် ကြွေပြားလုပ်ငန်း', nameEN: 'Flooring & Tiling', targetBudget: 0 },
  { id: 'cat_6', key: 'openings', nameMY: 'တံခါးနှင့် ပြတင်းပေါက် တပ်ဆင်ခြင်း', nameEN: 'Doors & Windows', targetBudget: 0 },
  { id: 'cat_7', key: 'finishing', nameMY: 'ဆေးသုတ်ခြင်းနှင့် အချောသတ်', nameEN: 'Painting & Finishing', targetBudget: 0 },
  { id: 'cat_8', key: 'labor', nameMY: 'လက်သမားနှင့် ပန်းရံ လုပ်အားခ', nameEN: 'Labor & Artisan Wages', targetBudget: 0 },
  { id: 'cat_9', key: 'misc', nameMY: 'ဒီဇိုင်း၊ ခွင့်ပြုချက်နှင့် အထွေထွေ', nameEN: 'Permits & Contingency', targetBudget: 0 },
];

export const DEFAULT_INITIAL_STAGES: CustomConstructionStage[] = [];

// Generate an 8-digit numeric manager ID e.g. "84920153"
export function generate8DigitManagerId(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Create a new Manager in Firestore
export async function createHouseManagerInFirestore(
  user: User,
  data: {
    name: string;
    location: string;
    password: string;
    startDate?: string;
    targetCompletionDate?: string;
    notes?: string;
  }
): Promise<HouseManagerDocument> {
  let managerId = generate8DigitManagerId();

  // Guard against any collision
  let ref = doc(db, 'house_managers', managerId);
  let snap = await getDoc(ref);
  let attempts = 0;
  while (snap.exists() && attempts < 5) {
    managerId = generate8DigitManagerId();
    ref = doc(db, 'house_managers', managerId);
    snap = await getDoc(ref);
    attempts++;
  }

  const now = Date.now();
  const creatorMember: ManagerMember = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
    role: 'admin',
    joinedAt: now,
    permissions: {
      canEditExpenses: true,
      canEditStages: true,
      canEditCategories: true,
      canManageUsers: true,
    },
  };

  const newDoc: HouseManagerDocument = {
    managerId,
    name: data.name.trim() || 'အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှု',
    location: data.location.trim() || 'မြန်မာနိုင်ငံ',
    password: data.password.trim(),
    creatorUid: user.uid,
    creatorEmail: user.email || '',
    createdAt: now,
    updatedAt: now,
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    targetCompletionDate: data.targetCompletionDate || '',
    notes: data.notes || '',
    members: [creatorMember],
    categories: DEFAULT_INITIAL_CATEGORIES,
    expenses: [],
    stages: DEFAULT_INITIAL_STAGES,
  };

  await setDoc(ref, newDoc);
  addRecentManagerId(managerId);
  setActiveManagerId(managerId);

  return newDoc;
}

// Join an existing manager by 8-digit ID and password
export async function joinHouseManagerInFirestore(
  user: User,
  managerId: string,
  passwordInput: string
): Promise<HouseManagerDocument> {
  const cleanId = managerId.trim();
  const cleanPass = passwordInput.trim();

  const ref = doc(db, 'house_managers', cleanId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error('MANAGER_NOT_FOUND');
  }

  const managerData = snap.data() as HouseManagerDocument;

  if (managerData.password !== cleanPass) {
    throw new Error('INVALID_PASSWORD');
  }

  // Check if user is already a member
  const existingMember = managerData.members.find((m) => m.uid === user.uid);
  if (!existingMember) {
    const isCreator = managerData.creatorUid === user.uid;
    const newMember: ManagerMember = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Member',
      role: isCreator ? 'admin' : 'editor',
      joinedAt: Date.now(),
      permissions: {
        canEditExpenses: true,
        canEditStages: true,
        canEditCategories: isCreator,
        canManageUsers: isCreator,
      },
    };

    const updatedMembers = [...managerData.members, newMember];
    await updateDoc(ref, {
      members: updatedMembers,
      updatedAt: Date.now(),
    });
    managerData.members = updatedMembers;
  }

  addRecentManagerId(cleanId);
  setActiveManagerId(cleanId);

  return managerData;
}

// Subscribe to real-time updates for an active manager
export function subscribeHouseManager(
  managerId: string,
  onUpdate: (data: HouseManagerDocument | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const ref = doc(db, 'house_managers', managerId);
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as HouseManagerDocument);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn('Real-time sync error on house manager:', err);
      onError?.(err);
    }
  );
}

// Update manager document in Firestore
export async function updateHouseManagerInFirestore(
  managerId: string,
  partial: Partial<HouseManagerDocument>
): Promise<void> {
  const ref = doc(db, 'house_managers', managerId);
  await updateDoc(ref, {
    ...partial,
    updatedAt: Date.now(),
  });
}

// Recent & Active Manager LocalStorage Helpers
export function getActiveManagerId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_MANAGER_KEY);
  } catch {
    return null;
  }
}

export function setActiveManagerId(managerId: string | null): void {
  try {
    if (managerId) {
      localStorage.setItem(ACTIVE_MANAGER_KEY, managerId);
    } else {
      localStorage.removeItem(ACTIVE_MANAGER_KEY);
    }
  } catch (err) {
    console.warn(err);
  }
}

export function getRecentManagerIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_MANAGERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentManagerId(managerId: string): void {
  try {
    const list = getRecentManagerIds().filter((id) => id !== managerId);
    list.unshift(managerId);
    localStorage.setItem(RECENT_MANAGERS_KEY, JSON.stringify(list.slice(0, 10)));
  } catch (err) {
    console.warn(err);
  }
}

export function removeRecentManagerId(managerId: string): void {
  try {
    const list = getRecentManagerIds().filter((id) => id !== managerId);
    localStorage.setItem(RECENT_MANAGERS_KEY, JSON.stringify(list));
    if (getActiveManagerId() === managerId) {
      setActiveManagerId(null);
    }
  } catch (err) {
    console.warn(err);
  }
}

// Completely delete a house manager from Firestore server
export async function deleteHouseManagerFromFirestore(managerId: string): Promise<void> {
  const cleanId = managerId.trim();
  const ref = doc(db, 'house_managers', cleanId);
  await deleteDoc(ref);
  removeRecentManagerId(cleanId);
}

// Clear all local storage data associated with house plan
export function clearHousePlanLocalStorage(): void {
  try {
    localStorage.removeItem(ACTIVE_MANAGER_KEY);
    localStorage.removeItem(RECENT_MANAGERS_KEY);
  } catch (err) {
    console.warn(err);
  }
}

// Fetch all projects managed/created by the authenticated admin user
export async function fetchUserManagedProjects(user: User): Promise<HouseManagerDocument[]> {
  try {
    const q = query(collection(db, 'house_managers'), where('creatorUid', '==', user.uid));
    const querySnapshot = await getDocs(q);
    const projects: HouseManagerDocument[] = [];
    querySnapshot.forEach((docSnap) => {
      projects.push(docSnap.data() as HouseManagerDocument);
    });
    return projects.sort(
      (a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0)
    );
  } catch (err) {
    console.warn('Failed to fetch user managed projects:', err);
    return [];
  }
}

