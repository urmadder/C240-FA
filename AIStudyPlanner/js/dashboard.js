document.addEventListener("DOMContentLoaded", () => {

    const token = sessionStorage.getItem("google_token");

    // Protect page
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Decode Google JWT
    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch {
            return null;
        }
    }

    const user = parseJwt(token);

    // Welcome message
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (user) {
        welcomeMessage.textContent = `Welcome, ${user.name || user.email} 👋`;
    }

    // Open Google Calendar
    const timetable = document.getElementById("timetable");

console.log(timetable);

timetable.addEventListener("click", () => {
    window.location.href = "https://calendar.google.com/";
});

    // Logout
    document.getElementById("logout").addEventListener("click", () => {
        sessionStorage.removeItem("google_token");
        window.location.href = "login.html";
    });

});
