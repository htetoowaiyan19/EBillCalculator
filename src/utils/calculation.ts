import { CalculationRecord, CustomNames, Language, MeterInputs } from '../types';
import { translations } from '../constants/translations';

export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '--';
  return Math.round(val).toLocaleString('en-US');
}

export function toCurrency(val: number, currency: string): string {
  return `${formatNumber(val)} ${currency}`;
}

export function calculateBill(
  inputs: MeterInputs,
  names: CustomNames,
  lang: Language
): { success: true; data: CalculationRecord } | { success: false; errorKey: 'errFillAll' | 'errZeroBill' | 'errZeroUnits' } {
  const p1 = parseFloat(inputs.p1Current);
  const p2 = parseFloat(inputs.p2Current);
  const shared = parseFloat(inputs.sharedCurrent);

  const p1P = parseFloat(inputs.p1Prev);
  const p2P = parseFloat(inputs.p2Prev);
  const sharedP = parseFloat(inputs.sharedPrev);

  const totalBill = parseFloat(inputs.totalBill);
  const sharedUsers = parseInt(inputs.sharedUsers, 10);

  if (
    isNaN(p1) ||
    isNaN(p2) ||
    isNaN(shared) ||
    isNaN(p1P) ||
    isNaN(p2P) ||
    isNaN(sharedP) ||
    isNaN(sharedUsers) ||
    sharedUsers <= 0
  ) {
    return { success: false, errorKey: 'errFillAll' };
  }

  if (isNaN(totalBill) || totalBill <= 0) {
    return { success: false, errorKey: 'errZeroBill' };
  }

  const dP1 = p1 - p1P;
  const dP2 = p2 - p2P;
  const dShared = shared - sharedP;

  const totalUnits = dP1 + dP2 + dShared;
  if (totalUnits <= 0) {
    return { success: false, errorKey: 'errZeroUnits' };
  }

  const ratePerUnit = totalBill / totalUnits;
  const costP1 = dP1 * ratePerUnit;
  const costP2 = dP2 * ratePerUnit;
  const costShared = dShared * ratePerUnit;
  const sharedPerUser = costShared / sharedUsers;

  const finalP1 = costP1 + sharedPerUser;
  const finalP2 = costP2 + sharedPerUser;

  const t = translations[lang];
  const now = new Date();
  const dateStr = `${now.getDate()} ${t.monthNames[now.getMonth()]} ${now.getFullYear()}`;

  const data: CalculationRecord = {
    id: 'calc_' + Date.now(),
    dateStr,
    timestamp: Date.now(),
    p1Name: names.p1.trim() || t.person1,
    p2Name: names.p2.trim() || t.person2,
    sharedName: names.shared.trim() || t.sharedMeter,
    p1Current: p1,
    p2Current: p2,
    sharedCurrent: shared,
    p1Prev: p1P,
    p2Prev: p2P,
    sharedPrev: sharedP,
    dP1,
    dP2,
    dShared,
    totalUnits,
    totalBill,
    ratePerUnit,
    costP1,
    costP2,
    costShared,
    sharedUsers,
    sharedPerUser,
    finalP1,
    finalP2
  };

  return { success: true, data };
}

export function generateViberText(data: CalculationRecord, lang: Language): string {
  if (lang === 'MY') {
    return `⚡ မီတာခ ခွဲဝေမှု စာရင်း (${data.dateStr})
-----------------------------------
👤 ${data.p1Name}: ${formatNumber(data.dP1)} ယူနစ် = ${formatNumber(data.costP1)} ကျပ်
💧 ရေစက်ဝေစု = ${formatNumber(data.sharedPerUser)} ကျပ်
👉 စုစုပေါင်း ကျသင့်ငွေ = ${formatNumber(data.finalP1)} ကျပ်

👤 ${data.p2Name}: ${formatNumber(data.dP2)} ယူနစ် = ${formatNumber(data.costP2)} ကျပ်
💧 ရေစက်ဝေစု = ${formatNumber(data.sharedPerUser)} ကျပ်
👉 စုစုပေါင်း ကျသင့်ငွေ = ${formatNumber(data.finalP2)} ကျပ်

💧 ${data.sharedName}: ${formatNumber(data.dShared)} ယူနစ် = ${formatNumber(data.costShared)} ကျပ်
(၁ ဦးလျှင် ကျသင့်ငွေ = ${formatNumber(data.sharedPerUser)} ကျပ်)
-----------------------------------
📌 သုံးစွဲယူနစ် စုစုပေါင်း = ${formatNumber(data.totalUnits)} ယူနစ်
📌 လျှပ်စစ်မီတာခ စုစုပေါင်း = ${formatNumber(data.totalBill)} ကျပ်
(၁ ယူနစ် ပျမ်းမျှ = ${formatNumber(data.ratePerUnit)} ကျပ်)`;
  }

  return `⚡ Electricity Bill Breakdown (${data.dateStr})
-----------------------------------
👤 ${data.p1Name}: ${formatNumber(data.dP1)} Units = ${formatNumber(data.costP1)} MMK
💧 Shared Meter Share = ${formatNumber(data.sharedPerUser)} MMK
👉 Total to Pay = ${formatNumber(data.finalP1)} MMK

👤 ${data.p2Name}: ${formatNumber(data.dP2)} Units = ${formatNumber(data.costP2)} MMK
💧 Shared Meter Share = ${formatNumber(data.sharedPerUser)} MMK
👉 Total to Pay = ${formatNumber(data.finalP2)} MMK

💧 ${data.sharedName}: ${formatNumber(data.dShared)} Units = ${formatNumber(data.costShared)} MMK
(Per user share = ${formatNumber(data.sharedPerUser)} MMK)
-----------------------------------
📌 Total Units Consumed = ${formatNumber(data.totalUnits)} Units
📌 Total Electricity Bill = ${formatNumber(data.totalBill)} MMK
(Average rate = ${formatNumber(data.ratePerUnit)} MMK/unit)`;
}
