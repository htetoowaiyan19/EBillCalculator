export interface TranslationSchema {
  lang: string;
  appTitle: string;
  appSubtitle: string;
  
  // Tabs
  tabCalculator: string;
  tabHistory: string;
  tabBackup: string;
  
  // Step 1: Current Month
  step1Title: string;
  person1: string;
  person2: string;
  sharedMeter: string;
  customNamesToggle: string;
  person1NamePlaceholder: string;
  person2NamePlaceholder: string;
  sharedMeterNamePlaceholder: string;

  // Step 2: Previous Month
  step2Title: string;
  fillPrevious: string;
  fillPreviousSuccess: string;
  fillPreviousEmpty: string;
  
  // Step 3: Total Bill
  step3Title: string;
  totalBillLabel: string;
  sharedUsersLabel: string;
  sharedUsersHelp: string;
  
  // Actions
  calculate: string;
  clear: string;
  saveToHistory: string;
  autoSaveCheckbox: string;
  savedSuccess: string;
  
  // Live Diff Badges
  units: string;
  unitUsed: string;
  increaseBadge: string;
  
  // Results Section
  resultsTitle: string;
  summaryTitle: string;
  finalToPay: string;
  subtotalUnits: string;
  sharedShare: string;
  totalBillResult: string;
  totalUnitsUsed: string;
  ratePerUnit: string;
  perUserCost: string;
  
  // Action Buttons in Results
  copyViber: string;
  viewReceipt: string;
  copiedToast: string;
  
  // Receipt Modal
  receiptTitle: string;
  receiptDate: string;
  receiptClose: string;
  receiptPrint: string;
  receiptCopyText: string;
  tableColName: string;
  tableColPrev: string;
  tableColCurr: string;
  tableColUnits: string;
  tableColAmount: string;
  
  // History Section
  historyTitle: string;
  noHistory: string;
  loadToCalc: string;
  loadedToCalcSuccess: string;
  delete: string;
  deleteAll: string;
  confirmDelete: string;
  confirmDeleteAll: string;
  confirmModalTitle: string;
  confirmBtnYes: string;
  confirmBtnNo: string;
  
  // Backup & Restore
  backupTitle: string;
  backupDesc: string;
  btnDownloadBackup: string;
  btnRestoreBackup: string;
  restoreSuccess: string;
  restoreInvalid: string;
  lblRestoreFile: string;
  clearEbillStorageTitle: string;
  clearEbillStorageDesc: string;
  clearEbillStorageBtn: string;
  confirmClearEbillStorage: string;
  clearEbillStorageSuccess: string;

  // Cloud & Auth
  signIn: string;
  register: string;
  account: string;
  logOut: string;
  cloudSync: string;
  localMode: string;
  syncLocalToCloud: string;
  syncSuccess: string;
  signedInSuccess: string;
  signedOutSuccess: string;
  registeredSuccess: string;
  googleSignIn: string;
  email: string;
  password: string;
  confirmPassword: string;
  passMismatch: string;
  passMinLength: string;
  
  // Alert / Errors
  errFillAll: string;
  errZeroUnits: string;
  errZeroBill: string;
  
  currency: string;
  unitWord: string;
  personWord: string;
  monthNames: string[];
  switchToHousePlan: string;
  switchToEbill: string;
  switchToHousePlanTooltip: string;
  switchToEbillTooltip: string;
}

export const translations: Record<'MY' | 'EN', TranslationSchema> = {
  MY: {
    lang: "မြန်မာ",
    appTitle: "မီတာခ ခွဲဝေတွက်ချက်စက်",
    appSubtitle: "အိမ်နီးချင်းများနှင့် မီတာခကို လွယ်ကူမျှတစွာ တွက်ချက်ခွဲဝေပါ",
    
    tabCalculator: "တွက်ချက်စက်",
    tabHistory: "မှတ်တမ်းဟောင်း",
    tabBackup: "အရန်သိမ်း/ပြန်ယူ",
    
    step1Title: "၁။ ယခုလ မီတာဖတ်ချက်များ",
    person1: "ပုဂ္ဂိုလ် ၁ (သို့) အခန်း ၁",
    person2: "ပုဂ္ဂိုလ် ၂ (သို့) အခန်း ၂",
    sharedMeter: "ရေစက် / ဘုံမီတာ",
    customNamesToggle: "အမည် ပြောင်းလိုပါက နှိပ်ပါ",
    person1NamePlaceholder: "ဥပမာ - ကိုမင်း / အခန်း (က)",
    person2NamePlaceholder: "ဥပမာ - ဦးဘ / အခန်း (ခ)",
    sharedMeterNamePlaceholder: "ဥပမာ - ရေစက်မီတာ",

    step2Title: "၂။ ယခင်လ မီတာဖတ်ချက်များ",
    fillPrevious: "ယခင်လ အချက်အလက် ယူမည်",
    fillPreviousSuccess: "ယခင်လ အချက်အလက်များ ဖြည့်ပြီးပါပြီ",
    fillPreviousEmpty: "ယခင်လ မှတ်တမ်း မရှိသေးပါ",
    
    step3Title: "၃။ စုစုပေါင်း ကျသင့်ငွေ",
    totalBillLabel: "လျှပ်စစ်မီတာခ စုစုပေါင်း (ကျပ်)",
    sharedUsersLabel: "ရေစက်/ဘုံမီတာ မျှဝေသုံးသူ အရေအတွက်",
    sharedUsersHelp: "မျှဝေသုံးစွဲသူ ဦးရေကို ထည့်သွင်းပါ",
    
    calculate: "တွက်ချက်မည်",
    clear: "အသစ်ပြန်စမည်",
    saveToHistory: "မှတ်တမ်းထဲ သိမ်းမည်",
    autoSaveCheckbox: "တွက်ချက်ပြီးပါက မှတ်တမ်းထဲ အလိုအလျောက် သိမ်းမည်",
    savedSuccess: "မှတ်တမ်းထဲသို့ သိမ်းဆည်းပြီးပါပြီ",
    
    units: "ယူနစ်",
    unitUsed: "သုံးစွဲယူနစ်",
    increaseBadge: "တိုး",
    
    resultsTitle: "တွက်ချက်မှု ရလဒ်များ",
    summaryTitle: "လူတစ်ဦးချင်း ကျသင့်ငွေ စာရင်း",
    finalToPay: "ပေးဆောင်ရမည့်ငွေ",
    subtotalUnits: "ယူနစ်ကျသင့်ငွေ",
    sharedShare: "ရေစက်ဘေ ဝေစု",
    totalBillResult: "စုစုပေါင်း မီတာခ",
    totalUnitsUsed: "စုစုပေါင်း သုံးစွဲယူနစ်",
    ratePerUnit: "၁ ယူနစ် ပျမ်းမျှကျသင့်ငွေ",
    perUserCost: "၁ ဦးလျှင် ကျသင့်ငွေ",
    
    copyViber: "Viber / စာတိုပို့ရန် ကူးမည်",
    viewReceipt: "ပြေစာပုံစံ ကြည့်မည်",
    copiedToast: "စာသား ကူးယူပြီးပါပြီ! Viber သို့ Paste လုပ်၍ ပို့နိုင်ပါပြီ။",
    
    receiptTitle: "မီတာခ ခွဲဝေမှု ပြေစာ",
    receiptDate: "ရက်စွဲ",
    receiptClose: "ပိတ်မည်",
    receiptPrint: "ပုံနှိပ်မည် / Print",
    receiptCopyText: "စာသားကူးမည်",
    tableColName: "အမည်",
    tableColPrev: "ယခင်",
    tableColCurr: "ယခု",
    tableColUnits: "ယူနစ်",
    tableColAmount: "ကျသင့်ငွေ",
    
    historyTitle: "လအလိုက် မီတာမှတ်တမ်းဟောင်းများ",
    noHistory: "မှတ်တမ်း မရှိသေးပါ။ တွက်ချက်ပြီး 'မှတ်တမ်းထဲ သိမ်းမည်' ကို နှိပ်ပါ",
    loadToCalc: "ပြန်လည်တွက်မည်",
    loadedToCalcSuccess: "အချက်အလက်များကို တွက်ချက်စက်ထဲ ထည့်သွင်းပြီးပါပြီ",
    delete: "ဖျက်မည်",
    deleteAll: "မှတ်တမ်းအားလုံး ဖျက်မည်",
    confirmDelete: "ဤမှတ်တမ်းကို ဖျက်ရန် သေချာပါသလား?",
    confirmDeleteAll: "မှတ်တမ်းအားလုံးကို အပြီးဖျက်ရန် သေချာပါသလား?",
    confirmModalTitle: "အတည်ပြုပါ",
    confirmBtnYes: "သေချာသည်",
    confirmBtnNo: "မလုပ်ပါ",
    
    backupTitle: "မှတ်တမ်း အရန်သိမ်းခြင်းနှင့် ပြန်လည်ရယူခြင်း",
    backupDesc: "ဖုန်းပြောင်းလဲသည့်အခါ (သို့) ဒေတာမပျောက်ပျက်စေရန် သင်၏ မီတာမှတ်တမ်းများကို ဖိုင်အဖြစ် ဒေါင်းလုဒ်ဆွဲထားနိုင်ပါသည်။",
    btnDownloadBackup: "မှတ်တမ်းဖိုင် သိမ်းဆည်းမည် (Download)",
    btnRestoreBackup: "မှတ်တမ်းဖိုင် ပြန်ထည့်မည် (Restore)",
    restoreSuccess: "မှတ်တမ်းများ အောင်မြင်စွာ ပြန်လည်ထည့်သွင်းပြီးပါပြီ",
    restoreInvalid: "ရွေးချယ်ထားသော ဖိုင် မှားယွင်းနေပါသည်",
    lblRestoreFile: "ဖိုင်မှ ပြန်လည်ထည့်သွင်းရန်",
    clearEbillStorageTitle: "ဖုန်းတွင်း သိမ်းဆည်းထားသော အချက်အလက်များ ဖျက်မည်",
    clearEbillStorageDesc: "ဖုန်းတွင်း (Local Storage) သိမ်းထားသော အမည်များ၊ ယခင်လဖတ်ချက်များနှင့် မှတ်တမ်းဟောင်းများကို ရှင်းလင်းဖျက်ထုတ်ပါမည်။",
    clearEbillStorageBtn: "အချက်အလက်များ ဖျက်ထုတ်မည် (Clear Storage)",
    confirmClearEbillStorage: "ဖုန်းတွင်းရှိ မီတာခ အချက်အလက်များနှင့် မှတ်တမ်းအားလုံးကို ရှင်းလင်းဖျက်ထုတ်ရန် သေချာပါသလား?",
    clearEbillStorageSuccess: "ဖုန်းတွင်း အချက်အလက်များကို အောင်မြင်စွာ ရှင်းထုတ်ပြီးပါပြီ",

    // Cloud & Auth
    signIn: "အကောင့်ဝင်ရန်",
    register: "အကောင့်ဖွင့်ရန်",
    account: "အကောင့်",
    logOut: "ထွက်မည်",
    cloudSync: "Cloud မှတ်တမ်းအသုံးပြုနေသည်",
    localMode: "ဖုန်းတွင်းမှတ်တမ်း (Local)",
    syncLocalToCloud: "ဖုန်းတွင်းမှတ်တမ်းများကို Cloud သို့ ပို့မည်",
    syncSuccess: "Cloud သို့ အောင်မြင်စွာ ပို့ဆောင်ပြီးပါပြီ",
    signedInSuccess: "အကောင့်ဝင်ရောက်ပြီးပါပြီ",
    signedOutSuccess: "အကောင့်မှ ထွက်ပြီးပါပြီ",
    registeredSuccess: "အကောင့်အသစ် ဖွင့်ပြီးပါပြီ",
    googleSignIn: "Google ဖြင့် ဝင်မည်",
    email: "အီးမေးလ်",
    password: "လျှို့ဝှက်နံပါတ်",
    confirmPassword: "လျှို့ဝှက်နံပါတ် အတည်ပြုပါ",
    passMismatch: "လျှို့ဝှက်နံပါတ် မတူညီပါ",
    passMinLength: "လျှို့ဝှက်နံပါတ် အနည်းဆုံး ၆ လုံး ရှိရပါမည်",
    
    errFillAll: "ကျေးဇူးပြု၍ ကိန်းဂဏန်း အားလုံးကို ပြည့်စုံစွာ ဖြည့်သွင်းပေးပါ",
    errZeroUnits: "ယခုလ မီတာဖတ်ချက်သည် ယခင်လထက် ပိုများရပါမည် (သုံးစွဲယူနစ် သုညထက် ကြီးရပါမည်)",
    errZeroBill: "စုစုပေါင်း မီတာခ ထည့်သွင်းပေးပါ",
    
    currency: "ကျပ်",
    unitWord: "ယူနစ်",
    personWord: "ဦး",
    monthNames: ["ဇန်နဝါရီ", "ဖေဖော်ဝါရီ", "မတ်", "ဧပြီ", "မေ", "ဇွန်", "ဇူလိုင်", "သြဂုတ်", "စက်တင်ဘာ", "အောက်တိုဘာ", "နိုဝင်ဘာ", "ဒီဇင်ဘာ"],
    switchToHousePlan: "အိမ်ဆောက် အစီအစဉ်",
    switchToEbill: "မီတာခ တွက်စက်",
    switchToHousePlanTooltip: "အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှုသို့ သွားမည်",
    switchToEbillTooltip: "မီတာခ ခွဲဝေတွက်ချက်စက်သို့ သွားမည်"
  },

  EN: {
    lang: "English",
    appTitle: "Electricity Bill Splitter",
    appSubtitle: "Fair and easy electricity bill splitting for neighbours",
    
    tabCalculator: "Calculator",
    tabHistory: "History",
    tabBackup: "Backup / Restore",
    
    step1Title: "1. Current Month Readings",
    person1: "Person 1 / Room 1",
    person2: "Person 2 / Room 2",
    sharedMeter: "Shared Meter (Water Pump / Hallway)",
    customNamesToggle: "Click to customize names",
    person1NamePlaceholder: "e.g., Ko Min / Room A",
    person2NamePlaceholder: "e.g., U Ba / Room B",
    sharedMeterNamePlaceholder: "e.g., Water Pump Meter",

    step2Title: "2. Previous Month Readings",
    fillPrevious: "Fill Previous Month Data",
    fillPreviousSuccess: "Previous readings filled successfully",
    fillPreviousEmpty: "No previous readings found",
    
    step3Title: "3. Total Bill Amount",
    totalBillLabel: "Total Electricity Bill (MMK)",
    sharedUsersLabel: "Number of Shared Meter Users",
    sharedUsersHelp: "Enter number of shared users",
    
    calculate: "Calculate Bill",
    clear: "Reset / Clear All",
    saveToHistory: "Save to History",
    autoSaveCheckbox: "Automatically save result to history",
    savedSuccess: "Saved to history successfully",
    
    units: "Units",
    unitUsed: "Used",
    increaseBadge: "+",
    
    resultsTitle: "Calculation Breakdown",
    summaryTitle: "Individual Payment Summary",
    finalToPay: "Total to Pay",
    subtotalUnits: "Unit Cost",
    sharedShare: "Shared Meter Share",
    totalBillResult: "Total Bill Amount",
    totalUnitsUsed: "Total Units Consumed",
    ratePerUnit: "Average Rate per Unit",
    perUserCost: "Cost per user",
    
    copyViber: "Copy for Viber / SMS",
    viewReceipt: "View Receipt Slip",
    copiedToast: "Summary copied to clipboard! Paste it into Viber or SMS.",
    
    receiptTitle: "Electricity Bill Receipt Slip",
    receiptDate: "Date",
    receiptClose: "Close",
    receiptPrint: "Print / Save as PDF",
    receiptCopyText: "Copy Slip Text",
    tableColName: "Name",
    tableColPrev: "Prev",
    tableColCurr: "Curr",
    tableColUnits: "Units",
    tableColAmount: "Amount",
    
    historyTitle: "Previous Monthly Records",
    noHistory: "No history records yet. Calculate and tap 'Save to History'.",
    loadToCalc: "Load to Calculator",
    loadedToCalcSuccess: "Loaded record into calculator",
    delete: "Delete",
    deleteAll: "Clear All History",
    confirmDelete: "Are you sure you want to delete this record?",
    confirmDeleteAll: "Are you sure you want to delete all history records?",
    confirmModalTitle: "Please Confirm",
    confirmBtnYes: "Confirm",
    confirmBtnNo: "Cancel",
    
    backupTitle: "Backup & Restore Records",
    backupDesc: "Download a backup file to keep your electricity records safe or transfer them when switching phones.",
    btnDownloadBackup: "Download Backup File (JSON)",
    btnRestoreBackup: "Restore from Backup File",
    restoreSuccess: "Records restored successfully",
    restoreInvalid: "Invalid backup file selected",
    lblRestoreFile: "Select Backup File",
    clearEbillStorageTitle: "Clear Local Storage Data",
    clearEbillStorageDesc: "Permanently clear all local storage cached data including saved names, previous readings, and history.",
    clearEbillStorageBtn: "Clear Local Storage",
    confirmClearEbillStorage: "Are you sure you want to clear all local storage records and cached data?",
    clearEbillStorageSuccess: "Local storage data cleared successfully",

    // Cloud & Auth
    signIn: "Sign in",
    register: "Register",
    account: "Account",
    logOut: "Log out",
    cloudSync: "Cloud Synced",
    localMode: "Local Storage Mode",
    syncLocalToCloud: "Upload Local History to Cloud",
    syncSuccess: "Uploaded to Cloud successfully",
    signedInSuccess: "Signed in successfully",
    signedOutSuccess: "Signed out successfully",
    registeredSuccess: "Account created successfully",
    googleSignIn: "Sign in with Google",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    passMismatch: "Passwords do not match",
    passMinLength: "Password must be at least 6 characters",
    
    errFillAll: "Please enter numeric values for all meter readings",
    errZeroUnits: "Current readings must be greater than previous readings (total units must be > 0)",
    errZeroBill: "Please enter the total bill amount",
    
    currency: "MMK",
    unitWord: "Units",
    personWord: "Users",
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    switchToHousePlan: "House Plan",
    switchToEbill: "E-Bill Splitter",
    switchToHousePlanTooltip: "Switch to House Plan Budget Manager",
    switchToEbillTooltip: "Switch to Electricity Bill Splitter"
  }
};
