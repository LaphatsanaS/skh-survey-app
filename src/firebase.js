
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAsGFja_SmTUcDoZ1SqAyxNIgTuNnTtSYw",
  authDomain: "skh-survey-app.firebaseapp.com",
  projectId: "skh-survey-app",
  storageBucket: "skh-survey-app.firebasestorage.app",
  messagingSenderId: "150757283950",
  appId: "1:150757283950:web:e04fe896a048500da22e7f",
  measurementId: "G-DTMY8WKT5V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;