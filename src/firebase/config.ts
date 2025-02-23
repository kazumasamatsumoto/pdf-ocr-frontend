import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0PBzpkB7KhqJcPIoZ8JE2zH97dl6Wufw",
  authDomain: "pdf-ocr-4806a.firebaseapp.com",
  projectId: "pdf-ocr-4806a",
  storageBucket: "pdf-ocr-4806a.firebasestorage.app",
  messagingSenderId: "527052965237",
  appId: "1:527052965237:web:ad60a04f2526f4c2793f3c",
  measurementId: "G-E5FGJMRKFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
