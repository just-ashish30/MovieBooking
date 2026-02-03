
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_Key,
  authDomain: "moviebooking-e05ee.firebaseapp.com",
  projectId: "moviebooking-e05ee",
  storageBucket: "moviebooking-e05ee.firebasestorage.app",
  messagingSenderId: "102324046056",
  appId: "1:102324046056:web:ad76d6f10a590d1e02a15d",
  measurementId: "G-6MLSPRZ515"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)