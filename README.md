# E-Bill Calculator (React + TypeScript + Tailwind CSS)

လွယ်ကူရှင်းလင်းပြီး သက်ကြီးပိုင်းများပါ အဆင်ပြေစွာ သုံးစွဲနိုင်သော **အိမ်နီးချင်းများ မီတာခ ခွဲဝေတွက်ချက်စက်** (React 18 + TypeScript + Tailwind CSS v3 + Vite + Firebase Cloud Sync) ဖြစ်ပါသည်။

---

## အဓိက လုပ်ဆောင်ချက်များ (Key Features) ✅

1. **🇲🇲 မြန်မာဘာသာ အပြည့်အစုံ ပါဝင်ခြင်း (Full Burmese Language Support)**
   - စာလုံးအရွယ်အစား ကြီးမားပြီး ရှင်းလင်းမြင်သာသော ဒီဇိုင်း (`Pyidaungsu` & `Inter` Typography)။
   - မြန်မာစာ / English စိတ်ကြိုက် ချက်ချင်းပြောင်းလဲ အသုံးပြုနိုင်ခြင်း။

2. **☁️ Cloud & Local Storage Hybrid Sync စနစ်**
   - **အကောင့်မဝင်ထားပါက (Not Logged In)**: ဖုန်းတွင်း Local Storage ဖြင့် ၁၀၀% အခမဲ့၊ လျင်မြန်စွာ မှတ်တမ်းတင် အသုံးပြုနိုင်ခြင်း။
   - **အကောင့်ဝင်ထားပါက (Logged In)**: Firebase Cloud Firestore ဖြင့် အလိုအလျောက် Sync လုပ်ပြီး မည်သည့်ဖုန်း/ကွန်ပျူတာမှမဆို မီတာမှတ်တမ်းဟောင်းများကို ကြည့်ရှုနိုင်ခြင်း။
   - **Email/Password** သို့မဟုတ် **Google Account** ဖြင့် ၁ ချက်နှိပ် အကောင့်ဝင်နိုင်ခြင်း။
   - ဖုန်းတွင်းရှိ မှတ်တမ်းများကို Cloud သို့ ၁ ချက်နှိပ် ပို့ဆောင်နိုင်ခြင်း (`Upload Local History to Cloud`)။

3. **📱 ၁ ချက်နှိပ် Viber / စာတိုပေးပို့ရန် စာသားကူးယူခြင်း (1-Tap Viber Sharing)**
   - တွက်ချက်ပြီးပါက Viber သို့မဟုတ် SMS တွင် အလွယ်တကူ Paste လုပ်ပြီး ပို့နိုင်သည့် စာရင်းရှင်းတမ်း အလိုအလျောက် ထုတ်ပေးခြင်း။

4. **📄 ပြေစာပုံစံ (Receipt Slip) ကြည့်ရှုခြင်းနှင့် Print ထုတ်ခြင်း**
   - ရက်စွဲ၊ မီတာဖတ်ချက်များနှင့် လူတစ်ဦးချင်း ကျသင့်ငွေများကို သပ်ရပ်စွာ ပြသပေးခြင်း။

5. **⚡ တိုက်ရိုက် သုံးစွဲယူနစ် တွက်ချက်ပြသခြင်း (Live Unit Badges)**
   - မီတာဖတ်ချက်များ ရိုက်ထည့်သည်နှင့် တိုးလာသော ယူနစ်များကို ချက်ချင်း မြင်တွေ့နိုင်ခြင်း။

6. **📥 ယခင်လ အချက်အလက်များကို ၁ ချက်နှိပ် ယူဆောင်ခြင်း (Fill Previous Month)**
   - ယခင်လ မီတာဖတ်ချက်များကို အလိုအလျောက် မှတ်သားထားပြီး ၁ ချက်နှိပ်ရုံဖြင့် ပြန်လည်ဖြည့်သွင်းပေးခြင်း။

7. **💾 အရန်သိမ်း/ပြန်ယူစနစ် (JSON Backup & Restore)**
   - `Backup (Download JSON)` နှင့် `Restore (Upload JSON)` ဖြင့် ဒေတာများ အချိန်မရွေး သိမ်းဆည်း/ရွှေ့ပြောင်းနိုင်ခြင်း။

8. **⚛️ Modern Tech Stack**
   - **React 18** with functional components and hooks
   - **TypeScript** with strict typing for calculations and storage models
   - **Tailwind CSS v3** with curated color tokens, dark mode, and responsive layout
   - **Firebase v10** (Authentication & Firestore Cloud database)
   - **Lucide React** icons
   - **Vite** for ultra-fast development and optimized production bundling

---

## စတင်အသုံးပြုပုံ (Getting Started)

```bash
# Dependencies တင်ရန်
npm install

# Dev Server စတင်ရန် (Development Mode)
npm run dev

# Production Build ထုတ်ရန်
npm run build

# Build Preview ကြည့်ရန်
npm run preview
```
