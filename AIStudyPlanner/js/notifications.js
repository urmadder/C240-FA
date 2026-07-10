// ===========================================
// notifications.js
// Browser Notification Engine
// ===========================================

document.addEventListener("DOMContentLoaded", () => {

    // ===========================================
    // Request Notification Permission
    // ===========================================

    if ("Notification" in window) {

        if (Notification.permission === "default") {

            Notification.requestPermission();

        }

    }

    // ===========================================
    // Show Notification Helper
    // ===========================================

    function showNotification(title, body) {

        if (!("Notification" in window)) return;

        if (Notification.permission !== "granted") return;

        new Notification(title, {
            body: body,
            icon: "favicon.ico" // optional
        });

    }

    // ===========================================
    // Current Time
    // ===========================================

    function getCurrentTime() {

        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");

        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${hours}:${minutes}`;

    }

    // ===========================================
    // Morning Reminder
    // ===========================================

    function checkMorningReminder() {

        const enabled =
            localStorage.getItem("morningToggle") === "true";

        if (!enabled) return;

        const reminderTime =
            localStorage.getItem("reminderTime") || "08:00";

        const currentTime = getCurrentTime();

        const today = new Date().toDateString();

        const alreadySent =
            localStorage.getItem("morningReminderSent");

        if (
            currentTime === reminderTime &&
            alreadySent !== today
        ) {

            showNotification(

                "📚 Morning Study Reminder",

                "Good morning! Time to start today's study session."

            );

            localStorage.setItem(

                "morningReminderSent",

                today

            );

        }

    }

    // ===========================================
    // Study Session Reminder
    // ===========================================

    function checkStudyReminder() {

        const enabled =
            localStorage.getItem("studyToggle") === "true";

        if (!enabled) return;

        const schedule = JSON.parse(

            localStorage.getItem("todaySchedule") || "[]"

        );

        const now = new Date();

        schedule.forEach(session => {

            const sessionTime = new Date();

            const [hour, minute] =
                session.time.split(":");

            sessionTime.setHours(hour);

            sessionTime.setMinutes(minute);

            sessionTime.setSeconds(0);

            const diff =
                (sessionTime - now) / 1000 / 60;

            const reminderKey =
                `studyReminder_${session.subject}_${session.time}`;

            const alreadySent =
                localStorage.getItem(reminderKey);

            if (

                diff <= 5 &&
                diff > 4 &&
                alreadySent !== new Date().toDateString()

            ) {

                showNotification(

                    "📖 Study Reminder",

                    `${session.subject} starts in 5 minutes.`

                );

                localStorage.setItem(

                    reminderKey,

                    new Date().toDateString()

                );

            }

        });

    }

    // ===========================================
    // Check Reminders
    // ===========================================

    function checkReminders() {

        checkMorningReminder();

        checkStudyReminder();

    }

    // Run immediately

    checkReminders();

    // Check every minute

    setInterval(

        checkReminders,

        60000

    );

});
