import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


onAuthStateChanged(auth, (user) => {

    if (user) {

        const welcomeMessage = document.getElementById("welcomeMessage");

        welcomeMessage.textContent = 
        `Welcome, ${user.displayName || user.email} 👋`;

        console.log("Logged in:", user.email);

    } else {

        window.location.href = "login.html";

    }

});


// Timetable button
const timetable = document.getElementById("timetable");

timetable.addEventListener("click", () => {
    window.location.href = "https://calendar.google.com/";
});


// Logout
document.getElementById("logout").addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});