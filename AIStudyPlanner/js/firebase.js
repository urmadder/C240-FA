// Import the functions you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBelXBkPhha_pwCA6Qsix2BRdJDDU1q6mM",
  authDomain: "ai-study-planner-1e39d.firebaseapp.com",
  projectId: "ai-study-planner-1e39d",
  storageBucket: "ai-study-planner-1e39d.firebasestorage.app",
  messagingSenderId: "526657588982",
  appId: "1:526657588982:web:8a08b546f86610bc3e66d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Export so other files can use them
export { app, db, auth };