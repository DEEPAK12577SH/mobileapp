/* ================================
   FIREBASE SDK IMPORTS
================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore,doc,setDoc,getDoc} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================================
   YOUR FIREBASE CONFIG
   (USE YOUR OWN PROJECT DETAILS)
================================ */
const firebaseConfig = {
  apiKey: "AIzaSyDvSdr05BQBAXycxIHzmOdSjJH5RKOpl-Y",
  authDomain: "mymoney-app-65074.firebaseapp.com",
  projectId: "mymoney-app-65074",
  storageBucket: "mymoney-app-65074.firebasestorage.app",
  messagingSenderId: "1039426143132",
  appId: "1:1039426143132:web:e7149c8ec55833e0353e59"
};

/* ================================
   INIT FIREBASE
================================ */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================================
   UNIQUE USER KEY (VERY IMPORTANT)
   SAME USER = SAME DATA IN ALL BROWSERS
================================ */
const USER_ID = "default-user"; // later you can replace with login

const DOC_REF = doc(db, "ledger_backup", USER_ID);

/* ================================
   1️⃣ LOAD DATA FROM FIREBASE
   BEFORE YOUR APP USES localStorage
================================ */
async function loadFromFirebase() {
  const snap = await getDoc(DOC_REF);
  if (snap.exists()) {
    const cloudData = snap.data().ledger_data;
    if (cloudData) {
      localStorage.setItem("ledger_data", JSON.stringify(cloudData));
      console.log("✅ Data loaded from Firebase");
    }
  } else {
    console.log("ℹ No cloud data yet");
  }
}

/* ================================
   2️⃣ SAVE DATA TO FIREBASE
================================ */
async function saveToFirebase(value) {
  await setDoc(DOC_REF, {
    ledger_data: JSON.parse(value),
    updatedAt: new Date()
  });
  console.log("☁ Data synced to Firebase");
}

/* ================================
   3️⃣ INTERCEPT localStorage.setItem
   (THIS IS THE MAGIC)
================================ */
const originalSetItem = localStorage.setItem;

localStorage.setItem = function (key, value) {
  originalSetItem.apply(this, arguments);

  if (key === "ledger_data") {
    saveToFirebase(value);
  }
};

/* ================================
   START EVERYTHING
================================ */
await loadFromFirebase();
