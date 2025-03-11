import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";  // ✅ Database import kiya

const firebaseConfig = {
  apiKey: "AIzaSyBsIp9DnWA9VmY0AUeLPVACuZQZjhiGClY",
  authDomain: "expense-tracker-6e6ac.firebaseapp.com",
  databaseURL: "https://expense-tracker-6e6ac-default-rtdb.firebaseio.com", // ✅ Realtime Database URL add kiya
  projectId: "expense-tracker-6e6ac",
  storageBucket: "expense-tracker-6e6ac.appspot.com", // ✅ `.app` nahi hota, `.appspot.com` correct hai
  messagingSenderId: "394113446994",
  appId: "1:394113446994:web:67e582ab12d4ebf0c59b8b",
  measurementId: "G-XT7T008EKB"
};

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getDatabase(app);  // ✅ Database initialize kiya

export { auth, googleProvider, db };  