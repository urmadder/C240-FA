console.log("settings.js loaded");

import { auth } from "./firebase.js";

import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// Wait until the page has loaded
document.addEventListener("DOMContentLoaded", () => {

    const profilePicture = document.getElementById("profilePicture");
    const displayName = document.getElementById("displayName");
    const email = document.getElementById("email");

    onAuthStateChanged(auth, (user) => {

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        // Display account information
        profilePicture.src = user.photoURL || "https://via.placeholder.com/100";

        displayName.value = user.displayName || "";

        email.value = user.email || "";

    });

});

// ===============================
// Theme Switching
// ===============================

const darkRadio = document.querySelector('input[value="dark"]');
const lightRadio = document.querySelector('input[value="light"]');

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";

if(savedTheme === "light"){
    document.body.classList.add("light-theme");
    lightRadio.checked = true;
}else{
    darkRadio.checked = true;
}

// Change theme
darkRadio.addEventListener("change", () => {

    document.body.classList.remove("light-theme");
    localStorage.setItem("theme","dark");

});

lightRadio.addEventListener("change", () => {

    document.body.classList.add("light-theme");
    localStorage.setItem("theme","light");

});
