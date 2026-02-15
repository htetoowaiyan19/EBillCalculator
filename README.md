# EBillCalculator

Converted to a simple Node.js static server and client-side Firebase Authentication (Email + Google).

## What's included ✅
- Node static server (`server.js`) to serve the existing front-end
- Firebase Auth (client) implemented in `script.js` — Email/password + Google sign-in
- Login / Register UI, Account profile modal and Logout
- User-specific history + previous-month data stored in **Firebase Firestore** (replaces Supabase)

## Run locally
1. Install deps: `npm install`
2. Start (dev): `npm run dev` (requires `nodemon`) or `npm start`
3. Open: `http://localhost:3000`

## Notes
- Firebase config (API key) is embedded in client code (intended for browser use).
- Firestore must be created in your Firebase project before saving/reading data. Create a Firestore database in the Firebase Console and choose the **asia-southeast1 (Singapore)** location.

Firestore setup (quick):
1. Open https://console.firebase.google.com → your project (`ebillcalculator`).
2. Database → Firestore → Create database → Start in **Production** or **Test** mode (your choice).
3. IMPORTANT: Select **asia-southeast1** when asked for the default location.
4. Add the following sample security rules (restricts reads/writes to the authenticated owner):

   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /history/{docId} {
         // allow create only when the incoming document's uid matches authenticated user
         allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
         // allow read/update/delete only for documents owned by the authenticated user
         allow read, update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
       }
       match /previous/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }

   IMPORTANT: If your rules previously used `resource.data.uid` for create, Firestore will reject document creation because `resource` does not exist on create — use `request.resource.data.uid` for create checks (as shown above).
- Authentication: Email/password and Google sign-in must be enabled in the Firebase Console → Authentication → Sign-in method.
- Language and theme preferences are stored in `localStorage` (persisted per-browser).
- If you see Firestore errors in the UI, confirm that Firestore exists and the security rules allow the operation (region: asia-southeast1).

