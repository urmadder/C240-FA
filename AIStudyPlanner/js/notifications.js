// ===========================================
// notifications.js
// Browser Notification Engine
// ===========================================

document.addEventListener("DOMContentLoaded", () => {


    // ===========================================
    // Show Notification Helper
    // ===========================================

    function showNotification(title, body) {

        if (!("Notification" in window)) return;
    
        if (Notification.permission !== "granted") return;
    
        const vibrationEnabled =
            localStorage.getItem("vibrationToggle") !== "false";
    
        const notification = new Notification(title, {
    
            body: body,
    
            icon: "images/ai-chatbot-logo.PNG",
    
            badge: "images/ai-chatbot-logo.PNG",
    
            requireInteraction: true,
    
            vibrate: vibrationEnabled
                ? [200, 100, 200]
                : undefined
    
        });
    
        notification.onclick = () => {
    
            notification.close();
    
            window.focus();
    
            window.location.href = "dashboard.html";
    
        };
    
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

                const name =
            localStorage.getItem("displayName") || "Student";
        
        let todaySchedule = [];
        
        try {
        
            todaySchedule =
                JSON.parse(localStorage.getItem("todaySchedule")) || [];
        
        }
        catch {
        
            todaySchedule = [];
        
        }
        
        let subjects = "";
        
        if (todaySchedule.length > 0) {
        
            subjects =
                todaySchedule
                    .map(item => item.subject)
                    .join(", ");
        
        } else {
        
            subjects = "No study sessions planned.";
        
        }
        
        showNotification(
        
            "📚 StudySync AI",
        
            `Good morning, ${name}! Today's subjects: ${subjects}`
        
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

       let schedule = [];

        try {
        
            schedule =
                JSON.parse(localStorage.getItem("todaySchedule")) || [];
        
        }
        
        catch {
        
            schedule = [];
        
        }

        const now = new Date();

        schedule.forEach(session => {

            const sessionTime = new Date();
            
            if (!session.time) return;
            
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

                    "📚 StudySync AI",
                
                    `${session.subject} begins in 5 minutes.\nGet your materials ready!`
                
                );

                localStorage.setItem(

                    reminderKey,

                    new Date().toDateString()

                );

            }

        });

    }


    // ===========================================
    // Midnight Reset
    // ===========================================
    
    function resetDailyNotifications() {
    
        const today =
            new Date().toDateString();
    
        const lastReset =
            localStorage.getItem("lastNotificationReset");
    
        if (lastReset !== today) {
    
            localStorage.removeItem("morningReminderSent");
    
            localStorage.setItem(
    
                "lastNotificationReset",
    
                today
    
            );
    
        }
    
    }
    
    
    // ===========================================
    // Check Reminders
    // ===========================================

    function checkReminders() {

        resetDailyNotifications();

        checkMorningReminder();

        checkStudyReminder();

    }

    // Run immediately

    checkReminders();

    // Check every 5 seconds

    setInterval(

        checkReminders,

        5000

    );

});
