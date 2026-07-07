import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


// Check Firebase login status
onAuthStateChanged(auth, (user) => {

    if (user) {

        const welcomeMessage = document.getElementById("welcomeMessage");

        if (welcomeMessage) {
            welcomeMessage.textContent =
            `Welcome, ${user.displayName || user.email} 👋`;
        }

        console.log("Logged in:", user.email);

    } else {

        console.log("No user found. Redirecting...");
        window.location.href = "login.html";

    }

});


// Timetable button
const timetable = document.getElementById("timetable");

if (timetable) {

    timetable.addEventListener("click", () => {
        window.location.href = "https://calendar.google.com/";
    });

}


// Logout button
const logout = document.getElementById("logout");

if (logout) {

    logout.addEventListener("click", async () => {

        await signOut(auth);

        window.location.href = "login.html";

    });

}