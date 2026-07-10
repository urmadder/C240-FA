import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


onAuthStateChanged(auth, (user) => {

    const welcomeMessage = document.getElementById("welcomeMessage");

    if (user) {

        if (welcomeMessage) {
            welcomeMessage.textContent =
            `Welcome, ${user.displayName || user.email} 👋`;
        }

    } else {

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

// ==========================
// Store Today's Schedule
// ==========================

const todaySchedule = [

    {
        subject: "Cloud Security Revision",
        time: "16:00"
    },

    {
        subject: "Network Security Practice",
        time: "18:30"
    },

    {
        subject: "Review Flashcards",
        time: "20:00"
    }

];

localStorage.setItem(

    "todaySchedule",

    JSON.stringify(todaySchedule)

);
