import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// n8n Webhooks
const N8N_DASHBOARD_URL = "https://n8ngc.codeblazar.org/webhook-test/dashboard";
const N8N_SCHEDULE_URL = "https://n8ngc.codeblazar.org/webhook-test/schedule";

// UI
const timetableBtn = document.getElementById("timetable");
const logoutBtn = document.getElementById("logout");

// Login check
onAuthStateChanged(auth, async (user) => {

    const welcomeMessage = document.getElementById("welcomeMessage");

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Welcome message
    if (welcomeMessage) {
        welcomeMessage.textContent =
            `Welcome, ${user.displayName || user.email} 👋`;
    }

    try {

        // -------------------------
        // Upcoming Exams
        // -------------------------

        const dashboardResponse = await fetch(
            `${N8N_DASHBOARD_URL}?uid=${user.uid}`
        );

        const dashboardData = await dashboardResponse.json();

        console.log("Dashboard:", dashboardData);

        // Example:
        // <span id="upcomingExamCount"></span>
        const examCount = document.getElementById("upcomingExamCount");

        if (examCount && dashboardData.upcomingExams !== undefined) {
            examCount.textContent = dashboardData.upcomingExams;
        }

        // -------------------------
        // Today's Schedule
        // -------------------------

        const scheduleResponse = await fetch(
            `${N8N_SCHEDULE_URL}?uid=${user.uid}`
        );

        const scheduleData = await scheduleResponse.json();

        console.log("Schedule:", scheduleData);

        // Example:
        // <div id="todaySchedule"></div>
        const scheduleBox = document.getElementById("todaySchedule");

        if (scheduleBox && scheduleData.schedule) {

            scheduleBox.innerHTML = "";

            scheduleData.schedule.forEach(item => {

                scheduleBox.innerHTML += `
                    <div class="schedule-item">
                        <strong>${item.time}</strong><br>
                        ${item.module}<br>
                        <small>${item.venue}</small>
                    </div>
                `;

            });

        }

    } catch (err) {

        console.error(err);

    }

});

// Google Calendar
if (timetableBtn) {
    timetableBtn.onclick = () => {
        window.location.href = "https://calendar.google.com/";
    };
}

// Logout
if (logoutBtn) {
    logoutBtn.onclick = async () => {
        await signOut(auth);
        window.location.href = "login.html";
    };
}