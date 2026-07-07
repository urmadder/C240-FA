import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ai-study-planner-1e39d.firebaseapp.com",
  projectId: "ai-study-planner-1e39d",
  storageBucket: "ai-study-planner-1e39d.firebasestorage.app",
  messagingSenderId: "526657588982",
  appId: "1:526657588982:web:8a08b546f86610bc3e66d7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, db, auth, provider };