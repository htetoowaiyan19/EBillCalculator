import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { translations } from './translation.js';

const supabase = createClient(
  'https://nnnstupxmcatpvlywlmg.supabase.co', // Your Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubnN0dXB4bWNhdHB2bHl3bG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjA1NDAsImV4cCI6MjA2NzM5NjU0MH0.vrt_QvYqVYXy0JCJjmODAkbhM5H-50chXcZdWuIDr7k' // Your anon public key
);

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

  const { data, error } = await supabase
    .from('history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    historySection.innerHTML = `
      <div class="container py-4">
        <h4><i class="bi bi-clock-history"></i> ${t.history}</h4>
        <p class="text-danger">Error loading history: ${error.message}</p>
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
    const dateStr = new Date(record.created_at).toLocaleString();

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
      if (confirm(t.delete + " record?")) {
        try {
          const { error } = await supabase.from('history').delete().eq('id', id);
          if (error) throw error;
          btn.closest('.accordion-item').remove();
        } catch (err) {
          alert(t.delete + " failed: " + err.message);
        }
      }
    });
  });
}

navHistory.addEventListener('click', async () => {
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

  document.getElementById('navCalculator').innerHTML = `<i class="bi bi-lightning"></i> ${t.calculator}`;
  document.getElementById('navHistory').innerHTML = `<i class="bi bi-clock-history"></i> ${t.history}`;
  document.querySelector('.header-title').textContent = "Electricity Bill Splitter";

  if (historySection.style.display === 'block') {
    renderHistory();
  }

  // Labels
  document.querySelector('[for="currentMonthReadings"]').innerHTML = `<i class="bi bi-person-fill"></i> ${t.currentMonthReadings}`;
  document.querySelector('[for="prevMonthReadings"]').innerHTML = `<i class="bi bi-person-fill"></i> ${t.prevMonthReadings}`;
  document.querySelector('[for="person1Bill"]').innerHTML = `<i class="bi bi-person-fill"></i> ${t.person1}`;
  document.querySelector('[for="person2Bill"]').innerHTML = `<i class="bi bi-person-fill"></i> ${t.person2}`;
  document.querySelector('[for="sharedBill"]').innerHTML = `<i class="bi bi-people-fill"></i> ${t.sharedMeter}`;
  document.querySelector('[for="previousPerson1Bill"]').innerHTML = `<i class="bi bi-person-fill"></i> ${t.person1}`;
  document.querySelector('[for="previousPerson2Bill"]').innerHTML = `<i class="bi bi-person-fill"></i> ${t.person2}`;
  document.querySelector('[for="previousSharedBill"]').innerHTML = `<i class="bi bi-people-fill"></i> ${t.sharedMeter}`;
  document.querySelector('[for="totalBillHeader"]').innerHTML = `<i class="bi bi-receipt"></i> ${t.totalBill}`;
  document.querySelector('[for="totalBill"]').innerHTML = `<i class="bi bi-receipt"></i> ${t.totalBill}`;
  document.getElementById('calculateBtn').innerHTML = `<i class="bi bi-calculator-fill"></i> ${t.calculate}`;
  document.getElementById('fillPreviousBtn').innerHTML = `<i class="bi bi-arrow-clockwise"></i> ${t.fillPrevious}`;

  // Results section (if visible)
  document.querySelector('#results h5').innerHTML = `<i class="bi bi-bar-chart-fill me-1"></i> ${t.results}`;
  document.querySelector('#results .col-md-6:nth-child(1) h6').textContent = t.current;
  document.querySelector('#results .col-md-6:nth-child(2) h6').textContent = t.increase;
  document.querySelector('#splitSharedBill').previousSibling.textContent = `${t.sharedSplit}: `;
  document.querySelector('#totalSharedUsers').previousSibling.textContent = `${t.totalSharedUsers}: `;
  document.querySelector('#results .col-md-6:last-child h6').textContent = t.finalBills;
}

// Apply theme from localStorage on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const isDark = savedTheme === 'dark';

  document.body.classList.toggle('dark-theme', isDark);
  document.getElementById('themeToggle').checked = isDark;

  applyTranslations();
});

// Theme Toggle Handler
document.getElementById('themeToggle').addEventListener('change', function () {
  const isDark = this.checked;
  document.body.classList.toggle('dark-theme', isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

document.getElementById('fillPreviousBtn').addEventListener('click', async () => {
  try {
    // Fetch the latest record (most recent) from history
    const { data, error } = await supabase
      .from('history')
      .select('person1_number, person2_number, shared_number')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      alert('Failed to fetch previous record: ' + error.message);
      return;
    }
    if (!data) {
      alert('No previous records found in the database.');
      return;
    }

    // Fill the previous month inputs with fetched values
    document.getElementById('previousPerson1Bill').value = data.person1_number ?? '';
    document.getElementById('previousPerson2Bill').value = data.person2_number ?? '';
    document.getElementById('previousSharedBill').value = data.shared_number ?? '';
  } catch (err) {
    alert('Error fetching previous record: ' + err.message);
  }
});

// Calculate button handler with Supabase save
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
    alert("Please enter all fields with numeric values.");
    return;
  }

  const dP1 = p1 - p1Prev;
  const dP2 = p2 - p2Prev;
  const dShared = shared - sharedPrev;

  const totalUnits = dP1 + dP2 + dShared;
  if (totalUnits <= 0) {
    alert("Invalid input: Total unit usage must be more than 0.");
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
  document.getElementById('sharedRecordIncrease').textContent = formatNumber(Math.round(dP2));

  document.getElementById('splitSharedBill').textContent = formatNumber(Math.round(sharedSplit)) + " MMK";
  document.getElementById('totalSharedUsers').textContent = totalSharedUsers;

  document.getElementById('p1ResultBill').textContent = toCurrency(resultP1);
  document.getElementById('p2ResultBill').textContent = toCurrency(resultP2);
  document.getElementById('totalResultBill').textContent = toCurrency(resultTotal);

  document.getElementById('results').style.display = 'block';

  // Save to Supabase (async)
  try {
    const { error } = await supabase.from('history').insert([
      {
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
      }
    ]);
    if (error) throw error;
  } catch (err) {
    alert('Failed to save history: ' + err.message);
  }
});

navCalculator.addEventListener('click', () => {
  navCalculator.classList.add('active');
  navHistory.classList.remove('active');
  calculatorSection.style.display = 'block';
  historySection.style.display = 'none';
});

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