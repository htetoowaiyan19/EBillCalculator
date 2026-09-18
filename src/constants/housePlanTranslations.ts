export interface HousePlanTranslationSchema {
  // App Titles & Navigation
  appTitle: string;
  appSubtitle: string;
  badgeHousePlan: string;
  switchToEbillTooltip: string;
  switchToHousePlanTooltip: string;
  switchToEbillButton: string;
  switchToHousePlanButton: string;

  // Auth & Manager Gate
  authRequiredTitle: string;
  authRequiredDesc: string;
  signInBtn: string;
  selectManagerTitle: string;
  createManagerCardTitle: string;
  createManagerCardDesc: string;
  joinManagerCardTitle: string;
  joinManagerCardDesc: string;
  modalCreateManagerTitle: string;
  modalJoinManagerTitle: string;
  inputManagerName: string;
  inputManagerPassword: string;
  inputManagerPasswordPlaceholder: string;
  inputManagerId: string;
  inputManagerIdPlaceholder: string;
  btnCreateManager: string;
  btnJoinManager: string;
  errManagerNotFound: string;
  errInvalidPassword: string;
  errFillManagerFields: string;
  adminProjectsTitle: string;
  adminProjectsDesc: string;
  quickOpenBtn: string;
  noAdminProjects: string;
  recentManagersTitle: string;
  switchManager: string;
  leaveManager: string;
  managerIdBadge: string;
  copyManagerId: string;
  copiedManagerId: string;

  // Permissions & Roles
  membersTitle: string;
  membersDesc: string;
  roleAdmin: string;
  roleEditor: string;
  roleViewer: string;
  permExpenses: string;
  permStages: string;
  permCategories: string;
  permManageUsers: string;
  viewerBadge: string;
  noPermissionToast: string;
  manageMembersBtn: string;

  // Tabs
  tabOverview: string;
  tabExpenses: string;
  tabStages: string;
  tabData: string;

  // Overview / Dashboard KPI
  totalBudget: string;
  totalSpent: string;
  remainingBudget: string;
  percentSpent: string;
  budgetHealthSafe: string;
  budgetHealthWarning: string;
  budgetHealthDanger: string;
  budgetHealthSafeDesc: string;
  budgetHealthWarningDesc: string;
  budgetHealthDangerDesc: string;

  // Project Info Card
  projectInfoTitle: string;
  projectInfoDesc: string;
  projectNameLabel: string;
  locationLabel: string;
  startDateLabel: string;
  targetDateLabel: string;
  editProjectBtn: string;
  saveProjectBtn: string;
  cancelBtn: string;
  projectUpdatedSuccess: string;

  // Category Breakdown Card & Dynamic Categories
  categoryBreakdownTitle: string;
  categoryBreakdownDesc: string;
  allocatedBudget: string;
  actualSpent: string;
  remainingCategory: string;
  addCategoryBtn: string;
  modalAddCategoryTitle: string;
  inputCategoryNameMY: string;
  inputCategoryNameEN: string;
  inputTargetBudget: string;
  categoryAddedSuccess: string;
  categoryUpdatedSuccess: string;
  categoryDeletedSuccess: string;
  editCategoryTarget: string;
  deleteCategory: string;
  confirmDeleteCategoryTitle: string;
  confirmDeleteCategoryDesc: string;

  // Expenses Tab & Table & Pagination
  expensesTitle: string;
  expensesDesc: string;
  addExpenseBtn: string;
  searchPlaceholder: string;
  filterCategoryAll: string;
  filterStatusAll: string;
  statusPaid: string;
  statusPending: string;
  tableColDate: string;
  tableColItem: string;
  tableColCategory: string;
  tableColPayee: string;
  tableColAmount: string;
  tableColStatus: string;
  tableColActions: string;
  noExpensesFound: string;
  totalFilteredCount: string;
  totalFilteredAmount: string;
  pageLabel: string;
  ofLabel: string;
  rowsPerPage: string;
  prevPage: string;
  nextPage: string;

  // Add / Edit Expense Modal
  modalAddTitle: string;
  modalEditTitle: string;
  inputItemTitle: string;
  inputItemPlaceholder: string;
  inputCategory: string;
  inputAmount: string;
  inputAmountPlaceholder: string;
  inputDate: string;
  inputPayee: string;
  inputPayeePlaceholder: string;
  inputStatus: string;
  inputNotes: string;
  inputNotesPlaceholder: string;
  saveExpenseBtn: string;
  expenseAddedSuccess: string;
  expenseUpdatedSuccess: string;
  expenseDeletedSuccess: string;
  errFillRequired: string;
  errInvalidAmount: string;

  // Stages & Milestones Tab
  stagesTitle: string;
  stagesDesc: string;
  stageProgress: string;
  stageStatusNotStarted: string;
  stageStatusInProgress: string;
  stageStatusCompleted: string;
  markStageComplete: string;
  markStageInProgress: string;
  overallProgress: string;
  stagesCompletedCount: string;
  addStageBtn: string;
  modalAddStageTitle: string;
  inputStageTitle: string;
  addTaskBtn: string;
  inputTaskPlaceholder: string;
  deleteStage: string;
  deleteTask: string;
  stageAddedSuccess: string;
  stageDeletedSuccess: string;
  confirmDeleteStageTitle: string;
  confirmDeleteStageDesc: string;
  filterAllStages: string;
  filterInProgress: string;
  filterCompleted: string;
  filterNotStarted: string;

  // Data & Backup Tab
  dataSettingsTitle: string;
  dataSettingsDesc: string;
  btnDownloadBackup: string;
  btnRestoreBackup: string;
  confirmDeleteExpenseTitle: string;
  confirmDeleteExpenseDesc: string;
  restoreSuccess: string;
  restoreInvalid: string;

  // Local Storage & Danger Zone
  clearLocalStorage: string;
  clearLocalStorageDesc: string;
  clearLocalStorageSuccess: string;
  confirmClearLocalStorageTitle: string;
  confirmClearLocalStorageDesc: string;
  dangerZoneTitle: string;
  dangerZoneDesc: string;
  deleteManagerBtn: string;
  deleteManagerAdminOnlyBadge: string;
  modalDeleteManagerTitle: string;
  deleteManagerWarningText: string;
  typeManagerIdToConfirm: string;
  confirmDeleteManagerBtn: string;
  managerDeletedSuccess: string;
  deleteManagerLoading: string;

  // Units and Currency
  currencySymbol: string;
  lakhUnit: string;
}

export const housePlanTranslations: Record<'MY' | 'EN', HousePlanTranslationSchema> = {
  MY: {
    appTitle: "အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှု",
    appSubtitle: "အိမ်ဆောက်လုပ်ရေး ကုန်ကျစရိတ်၊ အဆင့်များနှင့် ဘတ်ဂျက်ကို ထိန်းညှိပါ",
    badgeHousePlan: "House Plan",
    switchToEbillTooltip: "မီတာခ ခွဲဝေတွက်ချက်စက် (E-Bill) သို့ ပြောင်းမည်",
    switchToHousePlanTooltip: "အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှု (House Plan) သို့ ပြောင်းမည်",
    switchToEbillButton: "⚡ မီတာခ တွက်စက်",
    switchToHousePlanButton: "🏠 အိမ်ဆောက် အစီအစဉ်",

    authRequiredTitle: "အိမ်ဆောက် ဘတ်ဂျက် စီမံခန့်ခွဲမှုစနစ်",
    authRequiredDesc: "မိသားစုဝင်များနှင့် စာရင်းများ အချိန်နှင့်တပြေးညီ တူညီစွာကြည့်ရှုနိုင်ရန် Firestore Cloud Database ကို အသုံးပြုထားပါသည်။ ကျေးဇူးပြု၍ အကောင့်ဝင်ရောက်ပေးပါ။",
    signInBtn: "အကောင့်ဝင်မည်",
    selectManagerTitle: "အိမ်ဆောက် စီမံခန့်ခွဲမှု စာရင်း ရွေးချယ်ပါ",
    createManagerCardTitle: "စီမံခန့်ခွဲမှု အသစ်ဖွင့်မည်",
    createManagerCardDesc: "၈ လုံးပါ Manager ID နှင့် Password အလိုအလျောက် ထုတ်ပေးမည်ဖြစ်သည်",
    joinManagerCardTitle: "Manager ID ဖြင့် ဝင်ရောက်မည်",
    joinManagerCardDesc: "မိသားစု (သို့) ကန်ထရိုက်တာ ပေးထားသော ၈ လုံး ID နှင့် Password ဖြင့် ဝင်ရောက်ပါ",
    modalCreateManagerTitle: "အိမ်ဆောက် စီမံခန့်ခွဲမှု အသစ်ဖွင့်ခြင်း",
    modalJoinManagerTitle: "Manager ID ဖြင့် ဝင်ရောက်ခြင်း",
    inputManagerName: "စီမံကိန်း / အိမ်အမည်",
    inputManagerPassword: "ဝင်ရောက်ခွင့် စကားဝှက် (Password)",
    inputManagerPasswordPlaceholder: "အခြားသူများ ဝင်ရောက်နိုင်မည့် စကားဝှက်",
    inputManagerId: "Manager ID (ဂဏန်း ၈ လုံး)",
    inputManagerIdPlaceholder: "ဥပမာ - 83921045",
    btnCreateManager: "စီမံခန့်ခွဲမှု ဖန်တီးမည်",
    btnJoinManager: "ဝင်ရောက်မည်",
    errManagerNotFound: "ထို Manager ID ဖြင့် စာရင်း မတွေ့ရှိပါ",
    errInvalidPassword: "စကားဝှက် မှားယွင်းနေပါသည်",
    errFillManagerFields: "ကျေးဇူးပြု၍ အချက်အလက်များ ပြည့်စုံစွာ ဖြည့်သွင်းပါ",
    adminProjectsTitle: "သင်စီမံခန့်ခွဲနေသော စာရင်းများ (Admin)",
    adminProjectsDesc: "Password ရိုက်ထည့်ရန်မလိုဘဲ တိုက်ရိုက်ဝင်ရောက်နိုင်ပါသည်",
    quickOpenBtn: "တိုက်ရိုက်ဖွင့်မည်",
    noAdminProjects: "သင်ဖန်တီးထားသော စာရင်း မရှိသေးပါ",
    recentManagersTitle: "မကြာသေးမီက ဝင်ရောက်ထားသော စာရင်းများ",
    switchManager: "စီမံကိန်း ပြောင်းမည်",
    leaveManager: "ထွက်မည်",
    managerIdBadge: "Manager ID",
    copyManagerId: "ID ကူးမည်",
    copiedManagerId: "Manager ID ကူးယူပြီးပါပြီ",

    membersTitle: "အဖွဲ့ဝင်များနှင့် ခွင့်ပြုချက်များ",
    membersDesc: "စီမံကိန်းအတွင်းရှိ အဖွဲ့ဝင်များ၏ လုပ်ဆောင်ခွင့်များကို စီမံခန့်ခွဲပါ",
    roleAdmin: "စီမံခန့်ခွဲသူ (Admin)",
    roleEditor: "ပြင်ဆင်သူ (Editor)",
    roleViewer: "ဖတ်ရှုခွင့်သာ (Viewer)",
    permExpenses: "ကုန်ကျစရိတ် စာရင်းသွင်း/ပြင်ဆင်ခွင့်",
    permStages: "အဆင့်များနှင့် အလုပ်စစ်ဆေးခွင့်",
    permCategories: "ကဏ္ဍ ဘတ်ဂျက်သတ်မှတ်ခွင့်",
    permManageUsers: "အဖွဲ့ဝင်များ စီမံခန့်ခွဲခွင့်",
    viewerBadge: "ဖတ်ရှုခွင့်သာ",
    noPermissionToast: "သင့်တွင် ဤလုပ်ဆောင်ချက်ကို ပြုလုပ်ခွင့် မရှိပါ",
    manageMembersBtn: "အဖွဲ့ဝင် ခွင့်ပြုချက်များ",

    tabOverview: "အနှစ်ချုပ်",
    tabExpenses: "အသုံးစရိတ်",
    tabStages: "ဆောက်လုပ်ရေး",
    tabData: "ဒေတာ",

    totalBudget: "လျာထား စုစုပေါင်း ဘတ်ဂျက်",
    totalSpent: "သုံးစွဲပြီး စုစုပေါင်း",
    remainingBudget: "လက်ကျန် ဘတ်ဂျက်",
    percentSpent: "ဘတ်ဂျက် အသုံးပြုပြီးမှု",
    budgetHealthSafe: "ဘတ်ဂျက် စိတ်ချရသည်",
    budgetHealthWarning: "ဘတ်ဂျက် ကျော်လွန်တော့မည်",
    budgetHealthDanger: "ဘတ်ဂျက် ကျော်လွန်နေသည်",
    budgetHealthSafeDesc: "လျာထားဘတ်ဂျက် ၈၀% အောက်တွင် ပုံမှန်ရှိနေပါသည်",
    budgetHealthWarningDesc: "လျာထားဘတ်ဂျက်၏ ၈၀% ကျော် အသုံးပြုပြီးပါပြီ",
    budgetHealthDangerDesc: "စုစုပေါင်း ကုန်ကျစရိတ်သည် လျာထားဘတ်ဂျက်ထက် ကျော်လွန်နေပါသည်",

    projectInfoTitle: "အိမ်ဆောက် စီမံကိန်း အချက်အလက်",
    projectInfoDesc: "စီမံကိန်းအမည်၊ ဆောက်လုပ်မည့်နေရာနှင့် ရက်စွဲများကို သတ်မှတ်နိုင်ပါသည်",
    projectNameLabel: "စီမံကိန်း အမည်",
    locationLabel: "တည်နေရာ / မြေကွက်",
    startDateLabel: "စတင်သည့် ရက်စွဲ",
    targetDateLabel: "ပြီးစီးရန် လျာထားရက်",
    editProjectBtn: "အချက်အလက် ပြင်မည်",
    saveProjectBtn: "သိမ်းဆည်းမည်",
    cancelBtn: "မလုပ်တော့ပါ",
    projectUpdatedSuccess: "စီမံကိန်း အချက်အလက်များ သိမ်းဆည်းပြီးပါပြီ",

    categoryBreakdownTitle: "ကဏ္ဍအလိုက် ကုန်ကျစရိတ် ခွဲခြမ်းစိတ်ဖြာချက်",
    categoryBreakdownDesc: "လုပ်ငန်းကဏ္ဍတစ်ခုချင်းစီအလိုက် သတ်မှတ်ထားသော လျာထားငွေနှင့် သုံးစွဲငွေများ",
    allocatedBudget: "လျာထားငွေ",
    actualSpent: "သုံးစွဲငွေ",
    remainingCategory: "ကျန်ငွေ",
    addCategoryBtn: "ကဏ္ဍ အသစ်ထည့်မည်",
    modalAddCategoryTitle: "ကဏ္ဍ အသစ် သတ်မှတ်ခြင်း",
    inputCategoryNameMY: "ကဏ္ဍ အမည် (မြန်မာ)",
    inputCategoryNameEN: "ကဏ္ဍ အမည် (English)",
    inputTargetBudget: "လျာထားငွေ (ကျပ်)",
    categoryAddedSuccess: "ကဏ္ဍ အသစ် ထည့်သွင်းပြီးပါပြီ",
    categoryUpdatedSuccess: "ကဏ္ဍ လျာထားငွေ ပြင်ဆင်ပြီးပါပြီ",
    categoryDeletedSuccess: "ကဏ္ဍ ဖျက်ပြီးပါပြီ",
    editCategoryTarget: "လျာထားငွေ ပြင်ဆင်မည်",
    deleteCategory: "ကဏ္ဍ ဖျက်မည်",
    confirmDeleteCategoryTitle: "ဤကဏ္ဍကို ဖျက်ရန် သေချာပါသလား?",
    confirmDeleteCategoryDesc: "ဖျက်လိုက်ပါက ဤကဏ္ဍ၏ လျာထားငွေသည် စုစုပေါင်းဘတ်ဂျက်တွက်ချက်မှုမှ ဖယ်ရှားခံရပါမည်။",

    expensesTitle: "အသုံးစရိတ် မှတ်တမ်းစာရင်း",
    expensesDesc: "ဝယ်ယူထားသော ပစ္စည်းများနှင့် ပေးချေထားသော စရိတ်များကို စစ်ဆေးပါ",
    addExpenseBtn: "စရိတ်အသစ် ထည့်မည်",
    searchPlaceholder: "ပစ္စည်းအမည်၊ ဆိုင်အမည် ရှာရန်...",
    filterCategoryAll: "ကဏ္ဍ အားလုံး",
    filterStatusAll: "ငွေပေးချေမှု အားလုံး",
    statusPaid: "ပေးချေပြီး",
    statusPending: "ပေးရန်ကျန်",
    tableColDate: "ရက်စွဲ",
    tableColItem: "ပစ္စည်း / လုပ်ငန်းအမည်",
    tableColCategory: "ကဏ္ဍ",
    tableColPayee: "ဆိုင် / ကန်ထရိုက်တာ",
    tableColAmount: "ကျသင့်ငွေ",
    tableColStatus: "အခြေအနေ",
    tableColActions: "လုပ်ဆောင်ချက်",
    noExpensesFound: "အသုံးစရိတ် မှတ်တမ်း မတွေ့ရှိပါ",
    totalFilteredCount: "စုစုပေါင်း ပစ္စည်း",
    totalFilteredAmount: "စုစုပေါင်း ငွေပမာဏ",
    pageLabel: "စာမျက်နှာ",
    ofLabel: "မှ",
    rowsPerPage: "ပြသမည့် အရေအတွက်",
    prevPage: "ရှေ့သို့",
    nextPage: "နောက်သို့",

    modalAddTitle: "ကုန်ကျစရိတ် အသစ်ထည့်သွင်းခြင်း",
    modalEditTitle: "ကုန်ကျစရိတ် ပြင်ဆင်ခြင်း",
    inputItemTitle: "ပစ္စည်း (သို့) လုပ်ငန်းအမည်",
    inputItemPlaceholder: "ဥပမာ - ဘိလပ်မြေ (ဆင်တံဆိပ်) အိတ် ၅၀",
    inputCategory: "လုပ်ငန်း ကဏ္ဍ",
    inputAmount: "ငွေပမာဏ (ကျပ်)",
    inputAmountPlaceholder: "ဥပမာ - 750000",
    inputDate: "ရက်စွဲ",
    inputPayee: "ဆိုင် (သို့) ကန်ထရိုက်တာ အမည်",
    inputPayeePlaceholder: "ဥပမာ - ရွှေမိုး ဆောက်လုပ်ရေးပစ္စည်းဆိုင်",
    inputStatus: "ငွေပေးချေမှု အခြေအနေ",
    inputNotes: "မှတ်ချက် / ဘောက်ချာနံပါတ်",
    inputNotesPlaceholder: "ဘောက်ချာနံပါတ်၊ အရည်အသွေး မှတ်စုများ...",
    saveExpenseBtn: "စာရင်းသွင်းမည်",
    expenseAddedSuccess: "ကုန်ကျစရိတ် အသစ် ထည့်သွင်းပြီးပါပြီ",
    expenseUpdatedSuccess: "ကုန်ကျစရိတ် ပြင်ဆင်ပြီးပါပြီ",
    expenseDeletedSuccess: "ကုန်ကျစရိတ် ဖျက်ပြီးပါပြီ",
    errFillRequired: "ကျေးဇူးပြု၍ အမည်၊ ကဏ္ဍနှင့် ငွေပမာဏကို ဖြည့်သွင်းပါ",
    errInvalidAmount: "ငွေပမာဏသည် ၀ ထက် ကြီးရပါမည်",

    stagesTitle: "ဆောက်လုပ်ရေး အဆင့်များနှင့် လုပ်ငန်းစစ်ဆေးမှု",
    stagesDesc: "အဆင့်တစ်ခုချင်းစီ၏ ပြီးစီးမှုအခြေအနေကို စောင့်ကြည့်မှတ်သားပါ",
    stageProgress: "ပြီးစီးမှု ရာခိုင်နှုန်း",
    stageStatusNotStarted: "မစတင်ရသေး",
    stageStatusInProgress: "လုပ်ဆောင်နေဆဲ",
    stageStatusCompleted: "ပြီးစီးပါပြီ",
    markStageComplete: "ပြီးစီးကြောင်း သတ်မှတ်မည်",
    markStageInProgress: "လုပ်ဆောင်နေဆဲ သတ်မှတ်မည်",
    overallProgress: "အိမ်ဆောက်လုပ်မှု စုစုပေါင်း ပြီးစီးမှု",
    stagesCompletedCount: "ပြီးစီးသော အဆင့်များ",
    addStageBtn: "အဆင့်အသစ် ထည့်မည်",
    modalAddStageTitle: "ဆောက်လုပ်ရေး အဆင့်အသစ် ထည့်သွင်းခြင်း",
    inputStageTitle: "အဆင့် အမည်",
    addTaskBtn: "အလုပ်စစ်ဆေးချက် အသစ်ထည့်မည်",
    inputTaskPlaceholder: "လုပ်ဆောင်ရမည့် အလုပ်အမည် ရိုက်ထည့်ပါ...",
    deleteStage: "အဆင့် ဖျက်မည်",
    deleteTask: "ဖျက်မည်",
    stageAddedSuccess: "အဆင့်အသစ် ထည့်သွင်းပြီးပါပြီ",
    stageDeletedSuccess: "အဆင့် ဖျက်ပြီးပါပြီ",
    confirmDeleteStageTitle: "ဤအဆင့်ကို ဖျက်ရန် သေချာပါသလား?",
    confirmDeleteStageDesc: "ဖျက်လိုက်ပါက ဤအဆင့်အတွင်းရှိ အလုပ်စစ်ဆေးချက်များ အားလုံး ပျက်ပြယ်သွားပါမည်။",
    filterAllStages: "အားလုံး",
    filterInProgress: "လုပ်ဆောင်ဆဲ",
    filterCompleted: "ပြီးစီးပြီး",
    filterNotStarted: "မစတင်ရသေး",

    dataSettingsTitle: "ဒေတာ အရန်သိမ်းခြင်းနှင့် အဖွဲ့ဝင်ခွင့်ပြုချက်",
    dataSettingsDesc: "သင်၏ အိမ်ဆောက်ဘတ်ဂျက် စာရင်းများကို ဖိုင်အဖြစ် ဒေါင်းလုဒ်ဆွဲခြင်းနှင့် အဖွဲ့ဝင်များကို စီမံခန့်ခွဲပါ",
    btnDownloadBackup: "အိမ်ဆောက်စာရင်း သိမ်းဆည်းမည် (Download JSON)",
    btnRestoreBackup: "အိမ်ဆောက်စာရင်း ဖိုင်မှပြန်ယူမည် (Restore JSON)",
    confirmDeleteExpenseTitle: "ဤကုန်ကျစရိတ်ကို ဖျက်ရန် သေချာပါသလား?",
    confirmDeleteExpenseDesc: "ဖျက်ပြီးပါက ပြန်လည်ရယူနိုင်မည်မဟုတ်ပါ။",
    restoreSuccess: "အိမ်ဆောက်စာရင်း ဖိုင်မှ အောင်မြင်စွာ ပြန်လည်ထည့်သွင်းပြီးပါပြီ",
    restoreInvalid: "ရွေးချယ်ထားသော JSON ဖိုင် မှားယွင်းနေပါသည်",

    clearLocalStorage: "ဒေသတွင်း သိမ်းဆည်းဒေတာများ ရှင်းလင်းမည်",
    clearLocalStorageDesc: "ဤဖုန်း/ကွန်ပျူတာပေါ်ရှိ မကြာသေးမီက စီမံခန့်ခွဲမှုမှတ်တမ်းများနှင့် Cache ဒေတာများကို ဖျက်ထုတ်မည် (Server ဒေတာ မပျက်ပါ)",
    clearLocalStorageSuccess: "ဒေသတွင်း သိမ်းဆည်းဒေတာများ အောင်မြင်စွာ ရှင်းလင်းပြီးပါပြီ",
    confirmClearLocalStorageTitle: "ဒေသတွင်း သိမ်းဆည်းဒေတာများကို ရှင်းလင်းပါမည်လား?",
    confirmClearLocalStorageDesc: "ဤဖုန်း/ကွန်ပျူတာပေါ်တွင် မှတ်သားထားသော မကြာသေးမီက စာရင်းများနှင့် Cache ဒေတာများသာ ရှင်းလင်းသွားမည်ဖြစ်ပြီး Server ပေါ်ရှိ အချက်အလက်များ မပျက်ပြယ်ပါ။",
    dangerZoneTitle: "အန္တရာယ်ဇုန် (Danger Zone)",
    dangerZoneDesc: "စီမံကိန်း ဖျက်သိမ်းခြင်းနှင့် အရေးကြီးသော လုပ်ဆောင်ချက်များ",
    deleteManagerBtn: "စီမံခန့်ခွဲမှု စာရင်း အပြီးတိုင် ဖျက်မည်",
    deleteManagerAdminOnlyBadge: "Admin သာလျှင်",
    modalDeleteManagerTitle: "စီမံခန့်ခွဲမှု စာရင်း အပြီးတိုင် ဖျက်သိမ်းခြင်း",
    deleteManagerWarningText: "သတိပြုရန် - ဤလုပ်ဆောင်ချက်သည် စီမံခန့်ခွဲမှုစာရင်းနှင့်တကွ အသုံးစရိတ်များ၊ အဆင့်များနှင့် အချက်အလက်အားလုံးကို Firestore Server ပေါ်မှ အပြီးတိုင် ဖျက်ထုတ်ပါမည်။ ပြန်လည်ရယူနိုင်မည် မဟုတ်ပါ။",
    typeManagerIdToConfirm: "အတည်ပြုရန် Manager ID ({id}) အား အောက်တွင် ရိုက်ထည့်ပါ:",
    confirmDeleteManagerBtn: "Server မှ အပြီးတိုင် ဖျက်သိမ်းမည်",
    managerDeletedSuccess: "စီမံခန့်ခွဲမှု စာရင်းအား Server မှ အပြီးတိုင် ဖျက်သိမ်းပြီးပါပြီ",
    deleteManagerLoading: "Server မှ ဖျက်သိမ်းနေပါသည်...",

    currencySymbol: "ကျပ်",
    lakhUnit: "သိန်း",
  },

  EN: {
    appTitle: "House Construction & Budget Planner",
    appSubtitle: "Manage building expenses, project milestones, and stay on budget",
    badgeHousePlan: "House Plan",
    switchToEbillTooltip: "Switch to Electricity Bill Splitter (E-Bill)",
    switchToHousePlanTooltip: "Switch to House Plan Budget Manager",
    switchToEbillButton: "⚡ E-Bill Splitter",
    switchToHousePlanButton: "🏠 House Plan",

    authRequiredTitle: "House Budget Manager",
    authRequiredDesc: "Powered by Firestore Cloud Database for real-time collaboration with family & contractors. Please sign in to continue.",
    signInBtn: "Sign In",
    selectManagerTitle: "Select or Create a House Manager",
    createManagerCardTitle: "Create New Manager",
    createManagerCardDesc: "Auto-generates an 8-digit Manager ID and access password",
    joinManagerCardTitle: "Join with Manager ID",
    joinManagerCardDesc: "Enter the 8-digit ID and password provided by your family or builder",
    modalCreateManagerTitle: "Create New House Manager",
    modalJoinManagerTitle: "Join with Manager ID & Password",
    inputManagerName: "Project / House Name",
    inputManagerPassword: "Access Password",
    inputManagerPasswordPlaceholder: "Set password for shared access",
    inputManagerId: "Manager ID (8 Digits)",
    inputManagerIdPlaceholder: "e.g., 83921045",
    btnCreateManager: "Create Manager",
    btnJoinManager: "Join Manager",
    errManagerNotFound: "House Manager not found with this 8-digit ID",
    errInvalidPassword: "Incorrect access password",
    errFillManagerFields: "Please enter all required fields",
    adminProjectsTitle: "Your Managed Projects (Admin)",
    adminProjectsDesc: "1-Tap quick access without re-entering ID or password",
    quickOpenBtn: "Quick Open",
    noAdminProjects: "No projects managed by your account yet",
    recentManagersTitle: "Recently Accessed Managers",
    switchManager: "Switch Project",
    leaveManager: "Leave",
    managerIdBadge: "Manager ID",
    copyManagerId: "Copy ID",
    copiedManagerId: "Manager ID copied to clipboard",

    membersTitle: "Members & Permissions",
    membersDesc: "Manage team member roles and granular action permissions",
    roleAdmin: "Admin",
    roleEditor: "Editor",
    roleViewer: "Viewer",
    permExpenses: "Can create/edit expenses",
    permStages: "Can update stages & tasks",
    permCategories: "Can set category targets",
    permManageUsers: "Can manage user permissions",
    viewerBadge: "View Only",
    noPermissionToast: "You do not have permission for this action",
    manageMembersBtn: "Member Permissions",

    tabOverview: "Overview",
    tabExpenses: "Expenses",
    tabStages: "Stages",
    tabData: "Data",

    totalBudget: "Total Planned Budget",
    totalSpent: "Total Spent So Far",
    remainingBudget: "Remaining Budget",
    percentSpent: "Budget Utilized",
    budgetHealthSafe: "On Track & Healthy",
    budgetHealthWarning: "Approaching Budget Limit",
    budgetHealthDanger: "Over Budget Warning",
    budgetHealthSafeDesc: "Expenditure is safely within 80% of total allocation",
    budgetHealthWarningDesc: "Over 80% of allocated budget has been utilized",
    budgetHealthDangerDesc: "Actual expenses have exceeded your planned budget",

    projectInfoTitle: "Project Overview & Details",
    projectInfoDesc: "Configure project title, construction site location, and schedule",
    projectNameLabel: "Project Title",
    locationLabel: "Site Location",
    startDateLabel: "Start Date",
    targetDateLabel: "Target Completion Date",
    editProjectBtn: "Edit Project Info",
    saveProjectBtn: "Save Changes",
    cancelBtn: "Cancel",
    projectUpdatedSuccess: "Project details updated successfully",

    categoryBreakdownTitle: "Category Expense Breakdown",
    categoryBreakdownDesc: "Detailed breakdown of expenditures across construction areas",
    allocatedBudget: "Budget Allocation",
    actualSpent: "Actual Spent",
    remainingCategory: "Remaining",
    addCategoryBtn: "Add Category Target",
    modalAddCategoryTitle: "Add Custom Category Target",
    inputCategoryNameMY: "Category Name (Burmese)",
    inputCategoryNameEN: "Category Name (English)",
    inputTargetBudget: "Target Budget (MMK)",
    categoryAddedSuccess: "Category target added successfully",
    categoryUpdatedSuccess: "Category target updated successfully",
    categoryDeletedSuccess: "Category target removed successfully",
    editCategoryTarget: "Edit Target Budget",
    deleteCategory: "Delete Category",
    confirmDeleteCategoryTitle: "Delete this category target?",
    confirmDeleteCategoryDesc: "Its target budget will be deducted from the total planned budget.",

    expensesTitle: "Expense Ledger & Receipts",
    expensesDesc: "Track materials purchased, contractor advances, and labor expenses",
    addExpenseBtn: "Add Expense",
    searchPlaceholder: "Search item, supplier, note...",
    filterCategoryAll: "All Categories",
    filterStatusAll: "All Statuses",
    statusPaid: "Paid",
    statusPending: "Pending",
    tableColDate: "Date",
    tableColItem: "Item / Description",
    tableColCategory: "Category",
    tableColPayee: "Supplier / Contractor",
    tableColAmount: "Amount",
    tableColStatus: "Status",
    tableColActions: "Actions",
    noExpensesFound: "No expense records found matching criteria",
    totalFilteredCount: "Total Items",
    totalFilteredAmount: "Filtered Total",
    pageLabel: "Page",
    ofLabel: "of",
    rowsPerPage: "Rows per page",
    prevPage: "Prev",
    nextPage: "Next",

    modalAddTitle: "Record New Expense",
    modalEditTitle: "Edit Expense Item",
    inputItemTitle: "Item / Service Description",
    inputItemPlaceholder: "e.g. 50 Bags Cement (Elephant Brand)",
    inputCategory: "Construction Category",
    inputAmount: "Amount (MMK)",
    inputAmountPlaceholder: "e.g. 750000",
    inputDate: "Transaction Date",
    inputPayee: "Supplier / Contractor Name",
    inputPayeePlaceholder: "e.g. Shwe Moe Hardware & Building Store",
    inputStatus: "Payment Status",
    inputNotes: "Notes / Voucher Ref",
    inputNotesPlaceholder: "Voucher no., delivery notes, specs...",
    saveExpenseBtn: "Save Record",
    expenseAddedSuccess: "New expense record added successfully",
    expenseUpdatedSuccess: "Expense record updated successfully",
    expenseDeletedSuccess: "Expense record deleted successfully",
    errFillRequired: "Please enter item name, category, and a valid amount",
    errInvalidAmount: "Amount must be greater than 0",

    stagesTitle: "Construction Stages & Milestones",
    stagesDesc: "Monitor construction progress step-by-step from foundation to handover",
    stageProgress: "Completion Progress",
    stageStatusNotStarted: "Not Started",
    stageStatusInProgress: "In Progress",
    stageStatusCompleted: "Completed",
    markStageComplete: "Mark as Completed",
    markStageInProgress: "Set to In Progress",
    overallProgress: "Overall Project Progress",
    stagesCompletedCount: "Completed Stages",
    addStageBtn: "Add Custom Stage",
    modalAddStageTitle: "Add New Construction Stage",
    inputStageTitle: "Stage Title",
    addTaskBtn: "Add Checkmark Task",
    inputTaskPlaceholder: "Enter task item description...",
    deleteStage: "Delete Stage",
    deleteTask: "Delete Task",
    stageAddedSuccess: "New construction stage added successfully",
    stageDeletedSuccess: "Construction stage deleted successfully",
    confirmDeleteStageTitle: "Delete this stage?",
    confirmDeleteStageDesc: "All checklist tasks inside this stage will be permanently removed.",
    filterAllStages: "All Stages",
    filterInProgress: "In Progress",
    filterCompleted: "Completed",
    filterNotStarted: "Not Started",

    dataSettingsTitle: "Data & Team Management",
    dataSettingsDesc: "Export project JSON backups and manage shared access permissions",
    btnDownloadBackup: "Download Project Backup (JSON)",
    btnRestoreBackup: "Restore from File (JSON)",
    confirmDeleteExpenseTitle: "Delete this expense?",
    confirmDeleteExpenseDesc: "This transaction record will be permanently deleted.",
    restoreSuccess: "Project data successfully restored from backup file",
    restoreInvalid: "Invalid backup JSON file provided",

    clearLocalStorage: "Clear Local Storage Data",
    clearLocalStorageDesc: "Remove locally cached recent manager history and preferences on this device (server data remains safe)",
    clearLocalStorageSuccess: "Local storage data cleared successfully",
    confirmClearLocalStorageTitle: "Clear local storage data?",
    confirmClearLocalStorageDesc: "This will remove recently accessed manager IDs and cached preferences on this device only. Server data will not be affected.",
    dangerZoneTitle: "Danger Zone",
    dangerZoneDesc: "Irreversible actions and permanent project deletion",
    deleteManagerBtn: "Permanently Delete House Manager",
    deleteManagerAdminOnlyBadge: "Admin Only",
    modalDeleteManagerTitle: "Permanently Delete House Manager",
    deleteManagerWarningText: "Warning: This action will permanently erase this house manager along with all expenses, categories, milestones, and shared members from the Firestore Cloud Server. This cannot be undone.",
    typeManagerIdToConfirm: "Type the Manager ID ({id}) below to confirm:",
    confirmDeleteManagerBtn: "Permanently Delete from Server",
    managerDeletedSuccess: "House Manager permanently deleted from server",
    deleteManagerLoading: "Deleting from server...",

    currencySymbol: "MMK",
    lakhUnit: "Lakhs",
  },
};
