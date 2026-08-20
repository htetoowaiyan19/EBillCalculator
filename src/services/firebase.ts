import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  User
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { CalculationRecord, PreviousReadings } from '../types';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBNEMiRnB7ooAq7jrEtHD8GUHnqfGVtHeA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ebillcalculator.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ebillcalculator",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ebillcalculator.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "317646790991",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:317646790991:web:8255692e397007398f253a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3Z51TJJSBX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ===== Auth Methods =====

export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function registerWithEmail(email: string, pass: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

export async function loginWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (
      error.code === 'auth/operation-not-supported-in-this-environment' ||
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/popup-closed-by-user'
    ) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// ===== Cloud Firestore Methods =====

export async function saveHistoryToCloud(user: User, record: CalculationRecord): Promise<string> {
  const payload = {
    uid: user.uid,
    dateStr: record.dateStr,
    timestamp: record.timestamp,
    p1Name: record.p1Name,
    p2Name: record.p2Name,
    sharedName: record.sharedName,
    p1Current: record.p1Current,
    p2Current: record.p2Current,
    sharedCurrent: record.sharedCurrent,
    p1Prev: record.p1Prev,
    p2Prev: record.p2Prev,
    sharedPrev: record.sharedPrev,
    dP1: record.dP1,
    dP2: record.dP2,
    dShared: record.dShared,
    totalUnits: record.totalUnits,
    totalBill: record.totalBill,
    ratePerUnit: record.ratePerUnit,
    costP1: record.costP1,
    costP2: record.costP2,
    costShared: record.costShared,
    sharedUsers: record.sharedUsers,
    sharedPerUser: record.sharedPerUser,
    finalP1: record.finalP1,
    finalP2: record.finalP2,
    createdAt: serverTimestamp()
  };

  const ref = await addDoc(collection(db, 'history'), payload);
  return ref.id;
}

export async function fetchHistoryFromCloud(user: User, limitCount = 50): Promise<CalculationRecord[]> {
  try {
    const q = query(
      collection(db, 'history'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snaps = await getDocs(q);
    return snaps.docs.map((docSnap) => {
      const d = docSnap.data();
      let dateStr = d.dateStr;
      if (!dateStr && d.createdAt) {
        const ts = d.createdAt as Timestamp;
        dateStr = ts.toDate ? ts.toDate().toLocaleDateString() : new Date().toLocaleDateString();
      }
      return {
        id: docSnap.id,
        dateStr: dateStr || new Date().toLocaleDateString(),
        timestamp: d.timestamp || Date.now(),
        p1Name: d.p1Name || 'Person 1',
        p2Name: d.p2Name || 'Person 2',
        sharedName: d.sharedName || 'Shared Meter',
        p1Current: d.p1Current || 0,
        p2Current: d.p2Current || 0,
        sharedCurrent: d.sharedCurrent || 0,
        p1Prev: d.p1Prev || 0,
        p2Prev: d.p2Prev || 0,
        sharedPrev: d.sharedPrev || 0,
        dP1: d.dP1 || 0,
        dP2: d.dP2 || 0,
        dShared: d.dShared || 0,
        totalUnits: d.totalUnits || 0,
        totalBill: d.totalBill || 0,
        ratePerUnit: d.ratePerUnit || 0,
        costP1: d.costP1 || 0,
        costP2: d.costP2 || 0,
        costShared: d.costShared || 0,
        sharedUsers: d.sharedUsers || 3,
        sharedPerUser: d.sharedPerUser || 0,
        finalP1: d.finalP1 || 0,
        finalP2: d.finalP2 || 0
      };
    });
  } catch (err) {
    console.warn('Failed to fetch history from Cloud Firestore, falling back:', err);
    throw err;
  }
}

export async function deleteHistoryFromCloud(id: string): Promise<void> {
  await deleteDoc(doc(db, 'history', id));
}

export async function savePreviousToCloud(user: User, prev: PreviousReadings): Promise<void> {
  const ref = doc(db, 'previous', user.uid);
  await setDoc(ref, {
    p1: prev.p1,
    p2: prev.p2,
    shared: prev.shared,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function fetchPreviousFromCloud(user: User): Promise<PreviousReadings | null> {
  const ref = doc(db, 'previous', user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const d = snap.data();
    return {
      p1: d.p1 ?? d.person1_number,
      p2: d.p2 ?? d.person2_number,
      shared: d.shared ?? d.shared_number
    };
  }
  return null;
}
