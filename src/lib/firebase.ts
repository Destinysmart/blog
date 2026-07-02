import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyxYxh9eSlSy7BLQfHmkzfaJ2bZmPL3-8",
  authDomain: "gen-lang-client-0854992145.firebaseapp.com",
  projectId: "gen-lang-client-0854992145",
  storageBucket: "gen-lang-client-0854992145.firebasestorage.app",
  messagingSenderId: "1065401317450",
  appId: "1:1065401317450:web:4e3c82bae927fed11cceb3"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app, "ai-studio-bitlanceblog-e2b755df-755d-4852-a4bc-0220907937fb");

export { app, auth, db };
