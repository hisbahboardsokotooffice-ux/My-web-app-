// js/firebase-config.js
// Shared Firebase initialization (ES module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

// Use the Firebase config you provided
const firebaseConfig = {
  apiKey: "AIzaSyDlJg4qQKel1-cq5yhykn50VFdyxGo5pdk",
  authDomain: "sokoto-state-hisbah-boar-4f7ee.firebaseapp.com",
  projectId: "sokoto-state-hisbah-boar-4f7ee",
  storageBucket: "sokoto-state-hisbah-boar-4f7ee.firebasestorage.app",
  messagingSenderId: "48095687277",
  appId: "1:48095687277:web:cd333030607beaba110564",
  measurementId: "G-9522BN460N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

const { app, auth, db, storage };
