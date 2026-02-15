import { translations } from './translation.js';

// Firestore (replace Supabase)
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
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

// Firebase (client-side) - Auth (Email + Google)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect
} from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyBNEMiRnB7ooAq7jrEtHD8GUHnqfGVtHeA",
  authDomain: "ebillcalculator.firebaseapp.com",
  projectId: "ebillcalculator",
  storageBucket: "ebillcalculator.firebasestorage.app",
  messagingSenderId: "317646790991",
  appId: "1:317646790991:web:8255692e397007398f253a",
  measurementId: "G-3Z51TJJSBX"
};

const firebaseApp = initializeApp(firebaseConfig);
try { getAnalytics(firebaseApp); } catch(e) { /* analytics only works on https / supported env */ }
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Firestore helpers
async function saveHistoryForUser(user, record) {
  if (!user) throw new Error('Not authenticated');
  try {
    const payload = {
      uid: user.uid,
      person1_number: record.person1_number,
      person2_number: record.person2_number,
      shared_number: record.shared_number,
      previous_person1_number: record.previous_person1_number,
      previous_person2_number: record.previous_person2_number,
      previous_shared_number: record.previous_shared_number,
      total_bill: record.total_bill,
      result_person1: record.result_person1,
      result_person2: record.result_person2,
      result_total: record.result_total,
      createdAt: serverTimestamp()
    };
    const ref = await addDoc(collection(db, 'history'), payload);
    return ref.id;
  } catch (err) {
    throw new Error('Firestore write failed — make sure Firestore is created and rules allow authenticated writes (region: asia-southeast1).\n' + (err.message || err));
  }
}

async function updatePreviousForUser(user, prev) {
  if (!user) throw new Error('Not authenticated');
  try {
    const ref = doc(db, 'previous', user.uid);
    await setDoc(ref, {
      person1_number: prev.person1_number,
      person2_number: prev.person2_number,
      shared_number: prev.shared_number,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    throw new Error('Failed to update previous-month snapshot in Firestore — ensure Firestore exists and rules allow writes (region: asia-southeast1).\n' + (err.message || err));
  }
}

async function getPreviousForUser(user) {
  if (!user) return null;
  try {
    const ref = doc(db, 'previous', user.uid);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    throw new Error('Failed to read previous-month from Firestore — make sure Firestore is created (region: asia-southeast1).\n' + (err.message || err));
  }
}

async function fetchUserHistory(user, limitCount = 20) {
  if (!user) return [];
  try {
    const q = query(
      collection(db, 'history'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snaps = await getDocs(q);
    return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    throw new Error('Failed to read user history from Firestore — make sure Firestore is created and rules allow reads (region: asia-southeast1).\n' + (err.message || err));
  }
}

async function deleteHistoryById(id) {
  try {
    await deleteDoc(doc(db, 'history', id));
  } catch (err) {
    throw new Error('Failed to delete history record from Firestore.\n' + (err.message || err));
  }
}

// Update auth UI when state changes
function updateAuthUI(user) {
  const openAuthBtn = document.getElementById('openAuthBtn');
  const userBtn = document.getElementById('userBtn');
  const userEmailSpan = document.getElementById('userEmail');
  const userPhotoImg = document.getElementById('userPhoto');
  if (!openAuthBtn || !userBtn) return;

  if (user) {
    openAuthBtn.style.display = 'none';
    userBtn.style.display = 'flex';
    userEmailSpan.textContent = (user.displayName && user.displayName.trim()) ? user.displayName : (user.email || '');
    userPhotoImg.src = user.photoURL || 'https://via.placeholder.com/28?text=U';
  } else {
    openAuthBtn.style.display = 'inline-block';
    userBtn.style.display = 'none';
    userEmailSpan.textContent = '';
    userPhotoImg.src = 'https://via.placeholder.com/28?text=U';
  }
}

// Update mobile/offcanvas user UI (global so onAuthStateChanged can call it)
function updateMobileUser(user) {
  const mobileUserInfo = document.getElementById('mobileUserInfo');
  const mobileUserPhoto = document.getElementById('mobileUserPhoto');
  const mobileUserName = document.getElementById('mobileUserName');
  const mobileUserEmail = document.getElementById('mobileUserEmail');
  const mobileAccountBtn = document.getElementById('mobileAccountBtn');
  const mobileOpenAuthBtn = document.getElementById('mobileOpenAuthBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

  if (!mobileUserInfo) return;

  if (user) {
    mobileUserInfo.style.display = 'flex';
    if (mobileUserPhoto) mobileUserPhoto.src = user.photoURL || 'https://via.placeholder.com/40?text=U';
    if (mobileUserName) mobileUserName.textContent = (user.displayName && user.displayName.trim()) ? user.displayName : (user.email ? user.email.split('@')[0] : '');
    if (mobileUserEmail) mobileUserEmail.textContent = user.email || '';    if (mobileAccountBtn) mobileAccountBtn.style.display = 'inline-block';
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'inline-block';
    if (mobileOpenAuthBtn) mobileOpenAuthBtn.style.display = 'none';

    // ensure desktop account button shows a small avatar/text if available
    const userBtn = document.getElementById('userBtn');
    if (userBtn) userBtn.style.display = (user.email || user.displayName || user.photoURL) ? 'flex' : 'none';
  } else {
    mobileUserInfo.style.display = 'none';
    if (mobileAccountBtn) mobileAccountBtn.style.display = 'none';
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
    if (mobileOpenAuthBtn) mobileOpenAuthBtn.style.display = 'inline-block';

    const userBtn = document.getElementById('userBtn');
    if (userBtn) userBtn.style.display = 'none';
  }
}

onAuthStateChanged(auth, (user) => {
  updateAuthUI(user);
  const profileName = document.getElementById('profileName');
  const profileEmail = document.getElementById('profileEmail');
  const profilePhoto = document.getElementById('profilePhoto');
  if (user) {
    if (profileName) profileName.textContent = user.displayName || user.email || '';
    if (profileEmail) profileEmail.textContent = user.email || '';
    if (profilePhoto) profilePhoto.src = user.photoURL || 'https://via.placeholder.com/80?text=U';
  } else {
    if (profileName) profileName.textContent = '';
    if (profileEmail) profileEmail.textContent = '';
    if (profilePhoto) profilePhoto.src = 'https://via.placeholder.com/80?text=U';
  }

  // enable/disable UI parts that require authentication
  const fillBtn = document.getElementById('fillPreviousBtn');
  if (fillBtn) fillBtn.disabled = !user;

  // update mobile area if available
  if (typeof updateMobileUser === 'function') {
    try { updateMobileUser(user); } catch(e) { /* ignore */ }
  }

  // If user state changes and the History tab is visible, refresh it (user-specific)
  if (typeof historySection !== 'undefined' && historySection.style.display === 'block') {
    // Refresh history view when the user signs in/out
    try { renderHistory(); } catch (e) { /* ignore */ }
  }
});

// Wire up auth UI handlers once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const openAuthBtn = document.getElementById('openAuthBtn');
  const userBtn = document.getElementById('userBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const googleSignInBtn = document.getElementById('googleSignInBtn');

  if (openAuthBtn) {
    openAuthBtn.addEventListener('click', () => new bootstrap.Modal(document.getElementById('authModal')).show());
  }
  if (userBtn) {
    userBtn.addEventListener('click', () => new bootstrap.Modal(document.getElementById('accountModal')).show());
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
        const accountModalEl = document.getElementById('accountModal');
        bootstrap.Modal.getInstance(accountModalEl)?.hide();
        showMessage('Signed out', 'Account');
      } catch (err) {
        showMessage(err.message || 'Sign-out failed');
      }
    });
  }

  // Mobile / side-menu bindings
  const mobileOpenAuthBtn = document.getElementById('mobileOpenAuthBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  const mobileAccountBtn = document.getElementById('mobileAccountBtn');
  const mobileUserInfo = document.getElementById('mobileUserInfo');
  const mobileUserPhoto = document.getElementById('mobileUserPhoto');
  const mobileUserName = document.getElementById('mobileUserName');
  const mobileUserEmail = document.getElementById('mobileUserEmail');

  // also ensure the offcanvas close button explicitly hides (handles cases where data-bs-dismiss may be ignored)
  const offcanvasCloseBtn = document.querySelector('#sideMenu .btn-close');
  if (offcanvasCloseBtn) offcanvasCloseBtn.addEventListener('click', hideSideMenu);

  if (mobileOpenAuthBtn) {
    mobileOpenAuthBtn.addEventListener('click', () => {
      hideSideMenu();
      new bootstrap.Modal(document.getElementById('authModal')).show();
    });
  }
  if (mobileAccountBtn) {
    mobileAccountBtn.addEventListener('click', () => {
      hideSideMenu();
      new bootstrap.Modal(document.getElementById('accountModal')).show();
    });
  }
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', async () => {
      try {
        await signOut(auth);
        hideSideMenu();
        showMessage('Signed out', 'Account');
      } catch (err) {
        showMessage(err.message || 'Sign-out failed');
      }
    });
  }

  // mobile nav buttons
  const mNavCalc = document.getElementById('mobileNavCalculator');
  const mNavHist = document.getElementById('mobileNavHistory');
  if (mNavCalc) mNavCalc.addEventListener('click', () => { hideSideMenu(); navCalculator.click(); });
  if (mNavHist) mNavHist.addEventListener('click', () => { hideSideMenu(); navHistory.click(); });

  // sync mobile auth UI immediately after DOM ready (covers redirect sign-in flows)
  try { updateAuthUI(auth.currentUser); } catch (e) { /* ignore */ }
  try { updateMobileUser(auth.currentUser); } catch (e) { /* ignore */ }



  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage('Signed in', 'Account');
        bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
      } catch (err) {
        showMessage(err.message || 'Login failed');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      const confirm = document.getElementById('registerConfirmPassword')?.value;

      if (!password || password.length < 6) {
        showMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirm) {
        showMessage('Passwords do not match.');
        return;
      }

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        showMessage('Account created', 'Account');
        bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
      } catch (err) {
        showMessage(err.message || 'Registration failed');
      }
    });
  }

  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
        showMessage('Signed in with Google', 'Account');
        bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
      } catch (err) {
        // fallback to redirect for environments that block popups
        if (err.code && (err.code === 'auth/operation-not-supported-in-this-environment' || err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user')) {
          try {
            await signInWithRedirect(auth, provider);
            return;
          } catch (err2) {
            showMessage(err2.message || 'Google sign-in failed');
            return;
          }
        }
        showMessage(err.message || 'Google sign-in failed');
      }
    });
  }
});

// Tab Switching
const navCalculator = document.getElementById('navCalculator');
const navHistory = document.getElementById('navHistory');
const calculatorSection = document.querySelector('.container');
const historySection = document.createElement('div'); // Placeholder for history content

historySection.innerHTML = `
  <div class="container py-4">
    <h4><i class="bi bi-clock-history"></i> History</h4>
    <p class="text-muted">Loading records...</p>
  </div>
`;
historySection.style.display = 'none';
document.body.appendChild(historySection);

const toCurrency = (v) => formatNumber(Math.round(v)) + " " + translations[currentLang].currency;

async function renderHistory() {
  const t = translations[currentLang];

  historySection.innerHTML = `
    <div class="container py-4">
      <h4><i class="bi bi-clock-history"></i> ${t.history}</h4>
      <div id="historyAccordion" class="accordion"></div>
    </div>
  `;

  const accordion = document.getElementById('historyAccordion');

  const user = auth.currentUser;
  if (!user) {
    accordion.innerHTML = `<div class="p-3 text-muted">${t.loadingRecords}</div>`;
    accordion.insertAdjacentHTML('beforeend', `<p class="text-center mt-3 small text-muted">${t.signInToSave || 'Please sign in to view your history.'}</p>`);
    return;
  }

  let data = [];
  try {
    data = await fetchUserHistory(user, 20);
  } catch (err) {
    historySection.innerHTML = `
      <div class="container py-4">
        <h4><i class="bi bi-clock-history"></i> ${t.history}</h4>
        <p class="text-danger">Error loading history: ${err.message || err}</p>
      </div>`;
    return;
  }

  if (!data || data.length === 0) {
    historySection.innerHTML = `
      <div class="container py-4">
        <h4><i class="bi bi-clock-history"></i> ${t.history}</h4>
        <p class="text-muted">${t.noRecords}</p>
      </div>`;
    return;
  }

  accordion.innerHTML = '';

  data.forEach((record, index) => {
    const headerId = `heading${index}`;
    const collapseId = `collapse${index}`;
    const dateStr = record.createdAt && record.createdAt.toDate ? new Date(record.createdAt.toDate()).toLocaleString() : new Date().toLocaleString();

    accordion.insertAdjacentHTML('beforeend', `
      <div class="accordion-item">
        <h2 class="accordion-header d-flex align-items-center justify-content-between" id="${headerId}">
          <button class="accordion-button collapsed flex-grow-1 me-2" type="button" data-bs-toggle="collapse"
            data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}"
            style="font-size: 0.9rem; padding: 0.35rem 1rem;">
            <span class="caret-icon me-2" style="font-size:1rem;"><i class="bi bi-caret-right-fill"></i></span>
            <span class="summary-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              <strong>${dateStr}</strong> - 
              ${t.person1}: ${toCurrency(record.result_person1)},
              ${t.person2}: ${toCurrency(record.result_person2)},
              ${t.totalBill}: ${toCurrency(record.result_total)}
            </span>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger delete-record-btn"
            data-id="${record.id}" title="${t.delete}" style="padding: 0.15rem 0.35rem;">
            <i class="bi bi-trash"></i>
          </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headerId}"
          data-bs-parent="#historyAccordion">
          <div class="accordion-body" style="font-size: 0.85rem;">
            <ul class="list-unstyled mb-0">
              <li><strong>${t.person1}:</strong> ${formatNumber(record.person1_number)}</li>
              <li><strong>${t.person2}:</strong> ${formatNumber(record.person2_number)}</li>
              <li><strong>${t.sharedMeter}:</strong> ${formatNumber(record.shared_number)}</li>
              <li><strong>${t.prevPerson1}:</strong> ${formatNumber(record.previous_person1_number)}</li>
              <li><strong>${t.prevPerson2}:</strong> ${formatNumber(record.previous_person2_number)}</li>
              <li><strong>${t.prevSharedMeter}:</strong> ${formatNumber(record.previous_shared_number)}</li>
              <li><strong>${t.totalBill}:</strong> ${toCurrency(record.total_bill)}</li>
              <li><strong>${t.resultPerson1}:</strong> ${toCurrency(record.result_person1)}</li>
              <li><strong>${t.resultPerson2}:</strong> ${toCurrency(record.result_person2)}</li>
              <li><strong>${t.resultTotalBill}:</strong> ${toCurrency(record.result_total)}</li>
            </ul>
          </div>
        </div>
      </div>
    `);
  });

  // Add delete handlers
  const deleteButtons = accordion.querySelectorAll('.delete-record-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const confirmed = await showConfirm(t.delete + " record?");
      if (confirmed) {
        try {
          await deleteHistoryById(id);
          btn.closest('.accordion-item').remove();
        } catch (err) {
          showMessage(t.delete + " failed: " + (err.message || err));
        }
      }
    });
  });
}

navHistory.addEventListener('click', async () => {
  // close side menu on tab switch (mobile UX)
  hideSideMenu();

  navHistory.classList.add('active');
  navCalculator.classList.remove('active');
  calculatorSection.style.display = 'none';
  historySection.style.display = 'block';

  historySection.innerHTML = `
    <div class="container py-4">
      <h4><i class="bi bi-clock-history"></i> ${translations[currentLang].history}</h4>
      <div id="historyAccordion" class="accordion"></div>
    </div>
  `;

  const accordion = document.getElementById('historyAccordion');
  await renderHistory();
});

// Language Toggle
const langToggle = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
let currentLang = localStorage.getItem('language') || 'EN';

langToggle.checked = currentLang === 'MY';
langLabel.textContent = translations[currentLang]?.lang || currentLang;

langToggle.addEventListener('change', () => {
  currentLang = langToggle.checked ? 'MY' : 'EN';
  localStorage.setItem('language', currentLang);
  langLabel.textContent = translations[currentLang].lang;
  applyTranslations();
});

function applyTranslations() {
  const t = translations[currentLang];

  // Nav buttons
  document.getElementById('navCalculator').innerHTML = `<i class="bi bi-lightning"></i> <span id="textCalculator">${t.calculator}</span>`;
  document.getElementById('navHistory').innerHTML = `<i class="bi bi-clock-history"></i> <span id="textHistory">${t.history}</span>`;

  // Main header and subheader
  document.getElementById('headerTitle').textContent = t.appTitle || "Electricity Bill Splitter";
  document.getElementById('subHeaderText').textContent = t.appSubtitle || "Calculate and split your monthly usage fairly";

  // Section Titles (your div.form-title with IDs)
  document.getElementById('currentMonthTitle').innerHTML = `<i class="bi bi-calendar2-week-fill"></i> ${t.currentMonthReadings}`;
  document.getElementById('previousMonthTitle').innerHTML = `<i class="bi bi-clock-history"></i> ${t.prevMonthReadings}`;
  document.getElementById('totalBillTitle').innerHTML = `<i class="bi bi-cash-coin"></i> ${t.totalBill}`;

  // Input Labels
  document.getElementById('labelPerson1').innerHTML = `<i class="bi bi-person-fill"></i> ${t.person1}`;
  document.getElementById('labelPerson2').innerHTML = `<i class="bi bi-person-fill"></i> ${t.person2}`;
  document.getElementById('labelShared').innerHTML = `<i class="bi bi-people-fill"></i> ${t.sharedMeter}`;

  document.getElementById('labelPrevPerson1').innerHTML = `<i class="bi bi-person-fill"></i> ${t.person1}`;
  document.getElementById('labelPrevPerson2').innerHTML = `<i class="bi bi-person-fill"></i> ${t.person2}`;
  document.getElementById('labelPrevShared').innerHTML = `<i class="bi bi-people-fill"></i> ${t.sharedMeter}`;

  document.getElementById('labelTotal').innerHTML = `<i class="bi bi-receipt"></i> ${t.totalBill}`;

  // Buttons
  document.getElementById('btnCalculate').innerHTML = `<i class="bi"></i> ${t.calculate}`;
  document.getElementById('btnFillPrevious').innerHTML = `<i class="bi"></i> ${t.fillPrevious}`;
  const saveLabelEl = document.getElementById('saveToAccountLabel');
  if (saveLabelEl) saveLabelEl.textContent = t.saveToAccount || 'Save result to account';

  // Side-menu / mobile labels
  const mobileCalc = document.getElementById('mobileNavCalculator');
  const mobileHist = document.getElementById('mobileNavHistory');
  const sideMenuLabel = document.getElementById('sideMenuLabel');
  const mobileOpenAuthBtn = document.getElementById('mobileOpenAuthBtn');
  const mobileAccountBtn = document.getElementById('mobileAccountBtn');
  if (mobileCalc) mobileCalc.textContent = t.calculator || 'Calculator';
  if (mobileHist) mobileHist.textContent = t.history || 'History';
  if (sideMenuLabel) sideMenuLabel.textContent = t.calculator || 'Menu';
  if (mobileOpenAuthBtn) mobileOpenAuthBtn.textContent = t.calculator ? 'Sign in / Register' : 'Sign in / Register';
  if (mobileAccountBtn) mobileAccountBtn.textContent = 'Account';

  // Results section titles and labels
  document.getElementById('resultsTitle').innerHTML = `<i class="bi me-1"></i> ${t.results}`;
  document.getElementById('resultsCurrentTitle').textContent = t.current;
  document.getElementById('resultsIncreaseTitle').textContent = t.increase;

  document.getElementById('labelP1').textContent = `${t.person1}:`;
  document.getElementById('labelP2').textContent = `${t.person2}:`;
  document.getElementById('labelSharedRecord').textContent = `${t.sharedMeter}:`;

  document.getElementById('labelP1Increase').textContent = `${t.person1} ${t.increase}:`;
  document.getElementById('labelP2Increase').textContent = `${t.person2} ${t.increase}:`;
  document.getElementById('labelSharedIncrease').textContent = `${t.sharedMeter} ${t.increase}:`;

  document.getElementById('resultsSplitLabel').textContent = `${t.sharedSplit}:`;
  document.getElementById('resultsUsersLabel').textContent = `${t.totalSharedUsers}:`;

  document.getElementById('resultsFinalTitle').textContent = t.finalBills;
  document.getElementById('labelFinalP1').textContent = `${t.person1}:`;
  document.getElementById('labelFinalP2').textContent = `${t.person2}:`;
  document.getElementById('labelFinalTotal').textContent = `${t.totalBill}:`;
}

// Apply theme from localStorage on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';

  document.body.classList.toggle('dark-theme', isDark);
  document.getElementById('themeToggle').checked = isDark;

  applyTranslations();

  // defensive: ensure auth UI and mobile UI reflect current auth state immediately
  try { updateAuthUI(auth.currentUser); } catch (e) { /* ignore */ }
  try { updateMobileUser && updateMobileUser(auth.currentUser); } catch (e) { /* ignore */ }
});

// Theme Toggle Handler
document.getElementById('themeToggle').addEventListener('change', function () {
  const isDark = this.checked;
  document.body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

document.getElementById('fillPreviousBtn').addEventListener('click', async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      showMessage(translations[currentLang].signInToSave || 'Please sign in to use previous data');
      return;
    }

    const prev = await getPreviousForUser(user);
    if (!prev) {
      showMessage(translations[currentLang].noRecords || 'No previous records found.');
      return;
    }

    // Fill the previous month inputs with fetched values
    document.getElementById('previousPerson1Bill').value = prev.person1_number ?? '';
    document.getElementById('previousPerson2Bill').value = prev.person2_number ?? '';
    document.getElementById('previousSharedBill').value = prev.shared_number ?? '';
  } catch (err) {
    showMessage('Error fetching previous record: ' + (err.message || err));
  }
});

// Calculate button handler
document.getElementById('calculateBtn').addEventListener('click', async function () {
  const p1 = parseFloat(document.getElementById('person1Bill').value);
  const p2 = parseFloat(document.getElementById('person2Bill').value);
  const shared = parseFloat(document.getElementById('sharedBill').value);
  const p1Prev = parseFloat(document.getElementById('previousPerson1Bill').value);
  const p2Prev = parseFloat(document.getElementById('previousPerson2Bill').value);
  const sharedPrev = parseFloat(document.getElementById('previousSharedBill').value);
  const total = parseFloat(document.getElementById('totalBill').value);

  if (
    isNaN(p1) || isNaN(p2) || isNaN(shared) ||
    isNaN(p1Prev) || isNaN(p2Prev) || isNaN(sharedPrev) ||
    isNaN(total)
  ) {
    showMessage("Please enter all fields with numeric values.");
    return;
  }

  const dP1 = p1 - p1Prev;
  const dP2 = p2 - p2Prev;
  const dShared = shared - sharedPrev;

  const totalUnits = dP1 + dP2 + dShared;
  if (totalUnits <= 0) {
    showMessage("Invalid input: Total unit usage must be more than 0.");
    return;
  }

  const multiplier = total / totalUnits;

  const finalP1 = dP1 * multiplier;
  const finalP2 = dP2 * multiplier;
  const finalShared = dShared * multiplier;

  const sharedSplit = finalShared / 3; // Assuming 3 shared users
  const totalSharedUsers = 3;

  const resultP1 = finalP1 + sharedSplit;
  const resultP2 = finalP2 + sharedSplit;
  const resultTotal = resultP1 + resultP2 + sharedSplit;

  // Set detailed results
  document.getElementById('p1Record').textContent = formatNumber(Math.round(p1));
  document.getElementById('p2Record').textContent = formatNumber(Math.round(p2));
  document.getElementById('sharedRecord').textContent = formatNumber(Math.round(shared));

  document.getElementById('p1RecordIncrease').textContent = formatNumber(Math.round(dP1));
  document.getElementById('p2RecordIncrease').textContent = formatNumber(Math.round(dP2));
  document.getElementById('sharedRecordIncrease').textContent = formatNumber(Math.round(dShared));

  document.getElementById('splitSharedBill').textContent = toCurrency(sharedSplit);
  document.getElementById('totalSharedUsers').textContent = formatNumber(totalSharedUsers);

  document.getElementById('p1ResultBill').textContent = toCurrency(resultP1);
  document.getElementById('p2ResultBill').textContent = toCurrency(resultP2);
  document.getElementById('totalResultBill').textContent = toCurrency(resultTotal);

  document.getElementById('results').style.display = 'block';

  // Optionally save to user's Firestore (if checkbox checked)
  const saveChecked = document.getElementById('saveToAccount')?.checked;
  if (saveChecked) {
    const user = auth.currentUser;
    if (!user) {
      showMessage(translations[currentLang].signInToSave || 'Please sign in to save results');
    } else {
      try {
        await saveHistoryForUser(user, {
          person1_number: p1,
          person2_number: p2,
          shared_number: shared,
          previous_person1_number: p1Prev,
          previous_person2_number: p2Prev,
          previous_shared_number: sharedPrev,
          total_bill: total,
          result_person1: resultP1,
          result_person2: resultP2,
          result_total: resultTotal
        });
        // update "previous" snapshot for this user
        await updatePreviousForUser(user, {
          person1_number: p1,
          person2_number: p2,
          shared_number: shared
        });
      } catch (err) {
        const msg = (err && err.message) ? err.message : String(err);
        if (/permission|missing or insufficient permissions|permission-denied/i.test(msg)) {
          showMessage('Failed to save history: permission denied. Check Firestore rules (see README) and ensure Firestore exists in asia-southeast1.\n' + msg);
        } else {
          showMessage('Failed to save history: ' + msg);
        }
      }
    }
  }
});

// helper: hide the mobile side menu if it's open
function hideSideMenu() {
  const side = document.getElementById('sideMenu');
  if (!side) return;
  // Bootstrap adds 'show' when visible; hide via the active Offcanvas instance if present
  try {
    const inst = bootstrap.Offcanvas.getInstance(side);
    if (inst) { inst.hide(); return; }
    // fallback: call hide on a new instance (safe)
    new bootstrap.Offcanvas(side).hide();
  } catch (e) {
    // last-resort: toggle class so backdrop can be removed
    side.classList.remove('show');
    document.body.classList.remove('offcanvas-backdrop');
  }
}

navCalculator.addEventListener('click', () => {
  // close side menu on tab switch (mobile UX)
  hideSideMenu();

  navCalculator.classList.add('active');
  navHistory.classList.remove('active');
  calculatorSection.style.display = 'block';
  historySection.style.display = 'none';
});

function showConfirm(message) {
  return new Promise((resolve) => {
    const modalEl = document.getElementById('confirmModal');
    const modalBody = document.getElementById('confirmModalBody');
    const confirmOkBtn = document.getElementById('confirmOkBtn');
    const confirmCancelBtn = document.getElementById('confirmCancelBtn');

    modalBody.textContent = message;

    const modal = new bootstrap.Modal(modalEl);

    // Cleanup handlers to avoid duplicate calls
    function cleanup() {
      confirmOkBtn.removeEventListener('click', onOk);
      confirmCancelBtn.removeEventListener('click', onCancel);
      modalEl.removeEventListener('hidden.bs.modal', onCancel);
    }

    function onOk() {
      cleanup();
      resolve(true);
      modal.hide();
    }

    function onCancel() {
      cleanup();
      resolve(false);
    }

    confirmOkBtn.addEventListener('click', onOk);
    confirmCancelBtn.addEventListener('click', onCancel);

    // If user closes modal by clicking outside or pressing ESC
    modalEl.addEventListener('hidden.bs.modal', onCancel, { once: true });

    modal.show();
  });
}

function formatNumber(value) {
  const formatted = Math.round(value).toLocaleString(); // localized with commas, etc.
  if (currentLang === 'MY') {
    return toMyanmarDigits(formatted);
  }
  return formatted;
}

function toMyanmarDigits(str) {
  const arabicToMyanmar = {
    '0': '၀',
    '1': '၁',
    '2': '၂',
    '3': '၃',
    '4': '၄',
    '5': '၅',
    '6': '၆',
    '7': '၇',
    '8': '၈',
    '9': '၉'
  };
  return String(str).replace(/[0-9]/g, d => arabicToMyanmar[d]);
}