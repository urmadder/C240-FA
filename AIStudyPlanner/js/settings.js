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
            
            localStorage.setItem(
            
                "displayName",
            
                user.displayName || "Student"
            
            );

        }

        if (email) {

            email.value =
                user.email || "No email";

        }

    });



    // ==========================
    // Theme Settings
    // ==========================

    const darkRadio =
        document.querySelector('input[value="dark"]');

    const lightRadio =
        document.querySelector('input[value="light"]');


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

            document.body.classList.remove("light-theme");

            localStorage.setItem("theme", "dark");

        });

    }


    if (lightRadio) {

        lightRadio.addEventListener("change", () => {

            document.body.classList.add("light-theme");

            localStorage.setItem("theme", "light");

        });

    }



    // ==========================
    // Sidebar Navigation
    // ==========================

    const timetable =
        document.getElementById("timetable");


    if (timetable) {

        timetable.addEventListener("click", () => {

            window.location.href =
                "https://calendar.google.com/";

        });

    }



    // ==========================
    // Logout
    // ==========================

    const logout =
        document.getElementById("logout");


    if (logout) {

        logout.addEventListener("click", async () => {

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

        });

    }



    // ==========================
    // Notification Settings
    // ==========================

    const toggles = [

        "morningToggle",
        "studyToggle",
        "vibrationToggle"

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

    // ==========================
    // Browser Notification Permission
    // ==========================
    
    const notificationStatus =
        document.getElementById("notificationStatus");
    
    const enableNotifications =
        document.getElementById("enableNotifications");
    
    function updateNotificationStatus() {

        if (!notificationStatus) return;
    
        if (!("Notification" in window)) {
    
            notificationStatus.textContent = "❌ Not Supported";
    
            if (enableNotifications) {
    
                enableNotifications.style.display = "none";
    
            }
    
            return;
    
        }
    
        switch (Notification.permission) {
    
            case "granted":
    
                notificationStatus.textContent = "🟢 Enabled";
    
                if (enableNotifications) {
    
                    enableNotifications.style.display = "none";
    
                }
    
                break;
    
            case "denied":
    
                notificationStatus.textContent = "🔴 Blocked";
    
                if (enableNotifications) {
    
                    enableNotifications.style.display = "none";
    
                }
    
                break;
    
            default:
    
                notificationStatus.textContent = "🟡 Not Requested";
    
                if (enableNotifications) {
    
                    enableNotifications.style.display = "inline-block";
    
                }
    
        }
    
    }
    
    updateNotificationStatus();
    
    if (enableNotifications) {
    
        enableNotifications.addEventListener("click", async () => {
    
            const permission =
                await Notification.requestPermission();
    
            updateNotificationStatus();
    
            if (permission === "granted") {
    
                alert("Notifications enabled!");
    
            }
    
        });
    
    }
    
    
        if (reminderTime) {
    
            reminderTime.value =
                localStorage.getItem("reminderTime")
                || "08:00";
    
        }
    
    // ==========================
    // Test Notification
    // ==========================
            
    const testButton =
        document.getElementById("testNotification");
            
    if (testButton) {
            
        testButton.addEventListener("click", () => {

            if (!("Notification" in window)) {

                alert("Your browser doesn't support notifications.");
            
                return;
            
            }
            
            if (Notification.permission !== "granted") {
            
                alert("Please enable browser notifications first.");
            
                return;
            
            }
            
            const vibrationEnabled =
                localStorage.getItem("vibrationToggle") !== "false";
            
            const notification =
                new Notification("StudySync AI", {
            
                    body:
                        "This is a test notification. Your reminders are working correctly!",
            
                    icon:
                        "images/ai-chatbot-logo.PNG",
            
                    badge:
                        "images/ai-chatbot-logo.PNG",
            
                    requireInteraction: true,
            
                    vibrate:
                        vibrationEnabled
                            ? [200, 100, 200]
                            : undefined
            
                });
            
            notification.onclick = () => {
                notification.close();
            
                window.focus();
            
                window.location.href =
                    "settings.html";
            
            };
            
        });
            
    }    
    
        const saveButton =
            document.getElementById("saveNotifications");
    
    
        if (saveButton) {
    
            saveButton.addEventListener("click", () => {

            // Save toggle states

            toggles.forEach(id => {

                localStorage.setItem(

                    id,

                    document
                        .getElementById(id)
                        .classList.contains("active")

                );

            });


            // Save reminder time

           if (reminderTime) {

                localStorage.setItem(
            
                    "reminderTime",
            
                    reminderTime.value
            
                );
            
            }

                
            // Reset today's reminder so the new time can trigger
            localStorage.removeItem("morningReminderSent");

            
            // Tell notifications.js that settings changed
            window.dispatchEvent(new Event("settingsUpdated"));

            // Refresh the calendar
            renderCalendar();

            alert(
                "Notification settings saved!"
            );

        });

    }

    // ==========================
    // Calendar
    // ==========================

    const calendarGrid =
        document.getElementById("calendarGrid");

    const monthYear =
        document.getElementById("monthYear");

    const calendarDetails =
        document.getElementById("calendarDetails");

    const prevMonth =
        document.getElementById("prevMonth");

    const nextMonth =
        document.getElementById("nextMonth");

    let currentDate = new Date();


    function renderCalendar() {

        if (!calendarGrid) return;

        calendarGrid.innerHTML = "";

        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();

        monthYear.textContent =
            currentDate.toLocaleString(
                "default",
                {
                    month: "long",
                    year: "numeric"
                }
            );

        const firstDay =
            new Date(year, month, 1).getDay();

        const daysInMonth =
            new Date(year, month + 1, 0).getDate();


        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const empty =
                document.createElement("div");

            empty.className =
                "calendar-day empty";

            calendarGrid.appendChild(empty);

        }


        const history =
            JSON.parse(
                localStorage.getItem(
                    "notificationHistory"
                ) || "[]"
            );


        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const fullDate =
                new Date(
                    year,
                    month,
                    day
                ).toDateString();


            const dayHistory =
                history.filter(
                    item =>
                        item.date === fullDate
                );


            const dayBox =
                document.createElement("div");

            dayBox.className =
                "calendar-day";

            const today = new Date();

            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
            
                dayBox.classList.add("today");
            
            }

            let icon = "";

            if (
                dayHistory.some(
                    e =>
                        e.type ===
                        "Morning Reminder"
                )
            ) {

                icon += "☀️ ";

            }

            if (
                dayHistory.some(
                    e =>
                        e.type ===
                        "Study Reminder"
                )
            ) {

                icon += "📖 ";

            }


            dayBox.innerHTML = `

                <span class="calendar-number">

                    ${day}

                </span>

                <div>

                    ${icon}

                </div>

            `;


            if (
                dayHistory.length > 0
            ) {

                dayBox.classList.add(
                    "has-event"
                );

            }


            dayBox.addEventListener(
                "click",
                () => {

                    showDayDetails(
                        fullDate
                    );

                }
            );


            calendarGrid.appendChild(
                dayBox
            );

        }

    }



    function showDayDetails(date) {

        const history =
            JSON.parse(
                localStorage.getItem(
                    "notificationHistory"
                ) || "[]"
            );

        const events =
            history.filter(
                item =>
                    item.date === date
            );


        if (
            events.length === 0
        ) {

            calendarDetails.innerHTML = `

                <h3>
                    ${new Date(date).toLocaleDateString(
                        "en-SG",
                        {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    )}
                </h3>

                <p>

                    No reminders recorded.

                </p>

            `;

            return;

        }


        let html = `

            <h3>

                ${date}

            </h3>

        `;


    events.forEach(event => {
    
        html += `
    
            <div class="calendar-event ${event.type.replace(/\s+/g, '-').toLowerCase()}">
    
                <strong>${event.type}</strong>
    
                <br>
    
                ${event.message}
    
                <br>
    
                🕒 ${event.time}
    
            </div>
    
            <hr class="calendar-divider">
    
        `;
    
    });


        calendarDetails.innerHTML =
            html;

    }



    if (prevMonth) {

        prevMonth.addEventListener(
            "click",
            () => {

                currentDate.setMonth(

                    currentDate.getMonth() - 1

                );

                renderCalendar();

            }
        );

    }



    if (nextMonth) {

        nextMonth.addEventListener(
            "click",
            () => {

                currentDate.setMonth(

                    currentDate.getMonth() + 1

                );

                renderCalendar();

            }
        );

    }


    renderCalendar();
    
});
