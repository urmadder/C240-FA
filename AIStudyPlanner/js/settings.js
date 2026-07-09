import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Account Information
    // ==========================

    const profilePicture = document.getElementById("profilePicture");
    const displayName = document.getElementById("displayName");
    const email = document.getElementById("email");


    onAuthStateChanged(auth, (user) => {

        if (!user) {

            window.location.href = "login.html";
            return;

        }


        if (profilePicture) {

            profilePicture.src = user.photoURL || 
            "https://via.placeholder.com/100";

        }


        if (displayName) {

            displayName.value = user.displayName || "No name";

        }


        if (email) {

            email.value = user.email || "No email";

        }


    });



    // ==========================
    // Theme Settings
    // ==========================

    const darkRadio = document.querySelector(
        'input[value="dark"]'
    );

    const lightRadio = document.querySelector(
        'input[value="light"]'
    );


    const savedTheme = localStorage.getItem("theme") || "dark";


    if (savedTheme === "light") {

        document.body.classList.add("light-theme");

        if (lightRadio) {
            lightRadio.checked = true;
        }

    } else {

        if (darkRadio) {
            darkRadio.checked = true;
        }

    }



    if (darkRadio) {

        darkRadio.addEventListener("change", () => {

            document.body.classList.remove(
                "light-theme"
            );

            localStorage.setItem(
                "theme",
                "dark"
            );

        });

    }



    if (lightRadio) {

        lightRadio.addEventListener("change", () => {

            document.body.classList.add(
                "light-theme"
            );

            localStorage.setItem(
                "theme",
                "light"
            );

        });

    }



    // ==========================
    // Sidebar Navigation
    // ==========================


    const timetable = document.getElementById(
        "timetable"
    );


    if (timetable) {

        timetable.addEventListener(
            "click",
            () => {

                window.location.href =
                "https://calendar.google.com/";

            }
        );

    }



    // ==========================
    // Logout
    // ==========================


    const logout = document.getElementById(
        "logout"
    );


    if (logout) {

        logout.addEventListener(
            "click",
            async () => {

                try {

                    await signOut(auth);

                    window.location.href =
                    "login.html";

                } catch(error) {

                    console.error(
                        "Logout failed:",
                        error
                    );

                }

            }
        );

    }


});

// =========================
// Notification Settings
// =========================

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    currentUser = user;

    const userRef = doc(db, "users", user.uid);

    try {

        const snap = await getDoc(userRef);

        if (snap.exists()) {

            const settings = snap.data().notifications || {};

            setToggle("morningToggle", settings.morningReminder ?? true);
            setToggle("studyToggle", settings.studyReminder ?? true);
            setToggle("aiToggle", settings.aiSuggestions ?? true);

            document.getElementById("reminderTime").value =
                settings.reminderTime || "08:00";

        }

    } catch (err) {

        console.error("Failed to load notification settings", err);

    }

});


function setToggle(id, enabled) {

    const toggle = document.getElementById(id);

    if (!toggle) return;

    if (enabled) {

        toggle.classList.add("active");

    } else {

        toggle.classList.remove("active");

    }

}


["morningToggle","studyToggle","aiToggle"].forEach(id=>{

    const toggle=document.getElementById(id);

    if(!toggle) return;

    toggle.addEventListener("click",()=>{

        toggle.classList.toggle("active");

    });

});


document
.getElementById("saveNotifications")
.addEventListener("click", async ()=>{

    if(!currentUser) return;

    const saveButton=document.getElementById("saveNotifications");

    saveButton.disabled=true;
    saveButton.textContent="Saving...";

    try{

        const notificationSettings={

            morningReminder:
                document.getElementById("morningToggle")
                .classList.contains("active"),

            studyReminder:
                document.getElementById("studyToggle")
                .classList.contains("active"),

            aiSuggestions:
                document.getElementById("aiToggle")
                .classList.contains("active"),

            reminderTime:
                document.getElementById("reminderTime").value

        };

        await setDoc(

            doc(db,"users",currentUser.uid),

            {

                notifications: notificationSettings

            },

            {

                merge:true

            }

        );

        alert("Notification settings saved!");

    }

    catch(error){

        console.error(error);

        alert("Failed to save settings.");

    }

    finally{

        saveButton.disabled=false;
        saveButton.textContent="Save Preferences";

    }

});
