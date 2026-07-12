import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// ================================
// n8n Webhooks
// ================================
const N8N_DASHBOARD_URL = "https://n8ngc.codeblazar.org/webhook/dashboard";
const N8N_SCHEDULE_URL = "https://n8ngc.codeblazar.org/webhook/schedule";

console.log("✅ dashboard.js loaded");

// ================================
// UI Elements
// ================================
const timetableBtn = document.getElementById("timetable");
const logoutBtn = document.getElementById("logout");

const upcomingExamCount = document.getElementById("upcomingExamCount");
const nextExamText = document.getElementById("nextExamText");
const todaySchedule = document.getElementById("todaySchedule");

// ================================
// Login Check
// ================================
onAuthStateChanged(auth, async (user) => {

    console.log("🔐 Auth state:", user);

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Welcome message
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (welcomeMessage) {
        welcomeMessage.textContent =
            `Welcome, ${user.displayName || user.email} 👋`;
    }

    try {

        console.log("📤 Fetching dashboard for UID:", user.uid);

        // ================================
        // Upcoming Exams
        // ================================

        const dashboardResponse = await fetch(
            `${N8N_DASHBOARD_URL}?uid=${user.uid}`
        );

        const dashboardData = await dashboardResponse.json();

        console.log("📥 Dashboard Response:", dashboardData);

        if (upcomingExamCount) {
            upcomingExamCount.textContent =
                dashboardData.upcomingExams ?? 0;
        }

        if (nextExamText) {
            nextExamText.textContent =
                dashboardData.nextExamText ?? "No upcoming exams";
        }

        // ================================
        // Today's Schedule
        // ================================

        console.log("📤 Fetching schedule...");

        const scheduleResponse = await fetch(
            `${N8N_SCHEDULE_URL}?uid=${user.uid}`
        );

        const scheduleData = await scheduleResponse.json();

        console.log("📥 Schedule Response:", scheduleData);

        if (todaySchedule) {

            todaySchedule.innerHTML = "";

            if (
                scheduleData.schedule &&
                scheduleData.schedule.length > 0
            ) {

                scheduleData.schedule.forEach(item => {

                    todaySchedule.innerHTML += `
                        <div class="schedule-item">
                            <span>${item.time}</span>
                            <p>${item.module}</p>
                            <small>${item.venue}</small>
                        </div>
                    `;

                });

            } else {

                todaySchedule.innerHTML =
                    "<p>No study sessions for today.</p>";

            }
        }

    } catch (error) {

        console.error("❌ Dashboard Error:", error);

    }

});

// ================================
// Buttons
// ================================

if (timetableBtn) {
    timetableBtn.onclick = () => {
        window.location.href = "https://calendar.google.com/";
    };
}

if (logoutBtn) {
    logoutBtn.onclick = async () => {
        await signOut(auth);
        window.location.href = "login.html";
    };
}