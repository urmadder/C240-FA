import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";


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

            profilePicture.src =
                user.photoURL ||
                "https://via.placeholder.com/100";

        }


        if (displayName) {

            displayName.value =
                user.displayName || "No name";

        }


        if (email) {

            email.value =
                user.email || "No email";

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


    const savedTheme =
        localStorage.getItem("theme") || "dark";


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

    const timetable =
        document.getElementById("timetable");


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

    const logout =
        document.getElementById("logout");


    if (logout) {

        logout.addEventListener(
            "click",
            async () => {

                try {

                    await signOut(auth);

                    window.location.href =
                        "login.html";

                }
                catch (error) {

                    console.error(
                        "Logout failed:",
                        error
                    );

                }

            }
        );

    }


    // ==========================
    // Notification Settings
    // ==========================

    const toggles = [

        "morningToggle",
        "studyToggle",
        "aiToggle"

    ];


    toggles.forEach(id => {

        const toggle =
            document.getElementById(id);

        if (!toggle) return;

        const savedState =
            localStorage.getItem(id);

        if (
            savedState === null ||
            savedState === "true"
        ) {

            toggle.classList.add("active");

        }
        else {

            toggle.classList.remove("active");

        }

        toggle.addEventListener("click", () => {

            toggle.classList.toggle("active");

        });

    });



    const reminderTime =
        document.getElementById("reminderTime");


    if (reminderTime) {

        reminderTime.value =
            localStorage.getItem(
                "reminderTime"
            ) || "08:00";

    }



    const saveButton =
        document.getElementById(
            "saveNotifications"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            async () => {

                // Save locally

                toggles.forEach(id => {

                    localStorage.setItem(

                        id,

                        document
                            .getElementById(id)
                            .classList.contains("active")

                    );

                });


                localStorage.setItem(

                    "reminderTime",

                    reminderTime.value

                );


                // Store AI preference separately

                localStorage.setItem(

                    "aiSuggestionsEnabled",

                    document
                        .getElementById("aiToggle")
                        .classList.contains("active")

                );


                // ==========================
                // Send settings to n8n
                // ==========================

                const user = auth.currentUser;

                if (user) {

                    try {

                        await fetch(

                            "https://n8ngc.codeblazar.org/webhook/notification-settings",

                            {

                                method: "POST",

                                headers: {

                                    "Content-Type": "application/json"

                                },

                                body: JSON.stringify({

                                    uid: user.uid,

                                    email: user.email,

                                    morningReminder:

                                        document
                                            .getElementById("morningToggle")
                                            .classList.contains("active"),

                                    studyReminder:

                                        document
                                            .getElementById("studyToggle")
                                            .classList.contains("active"),

                                    aiSuggestions:

                                        document
                                            .getElementById("aiToggle")
                                            .classList.contains("active"),

                                    reminderTime:

                                        reminderTime.value

                                })

                            }

                        );

                        console.log(
                            "Notification settings sent to n8n."
                        );

                    }
                    catch (error) {

                        console.error(

                            "Failed to send settings to n8n:",

                            error

                        );

                    }

                }


                alert(
                    "Notification settings saved!"
                );

            }

        );

    }

});
