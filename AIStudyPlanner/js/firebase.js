// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
export { app };