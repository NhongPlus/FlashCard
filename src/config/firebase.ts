    // src/firebase.ts
import { initializeApp } from "firebase/app";
// truy cập vào auth , chuyên để sử dụng Authentication của fire base
import { getAuth } from "firebase/auth"; 
// truy cập vào store , chuyên để sử dụng Cloud Firestore của fire base
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgnvZogAsTqBF5_OGhawL7V3an1XZTPFw",
  authDomain: "flashcardweb2025.firebaseapp.com",
  projectId: "flashcardweb2025",
  storageBucket: "flashcardweb2025.firebasestorage.app",
  messagingSenderId: "316571841393",
  appId: "1:316571841393:web:862714c968d43a7c29bcd0",
  measurementId: "G-6WZQTCGCV0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// khởi tạo auth
export const db = getFirestore(app);
// khởi tạo db
export default app;