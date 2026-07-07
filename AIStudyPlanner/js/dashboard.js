import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


onAuthStateChanged(auth, (user) => {

    console.log("Firebase user:", user);

    const welcomeMessage = document.getElementById("welcomeMessage");

    if (user) {

        console.log("Logged in:", user.email);

        if (welcomeMessage) {
            welcomeMessage.textContent =
            `Welcome, ${user.displayName || user.email} 👋`;
        }

    } else {

        console.log("No Firebase user detected");

        if (welcomeMessage) {
            welcomeMessage.textContent =
            "No user detected";
        }

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