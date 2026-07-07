document.addEventListener("DOMContentLoaded", () => {

    const token = sessionStorage.getItem("google_token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch {
            return null;
        }
    }

    const user = parseJwt(token);

    if (user) {
        document.getElementById("welcomeMessage").textContent =
            `Welcome, ${user.name || user.email} 👋`;
    }

    // Open Google Calendar
    document.getElementById("timetable").addEventListener("click", () => {
        window.open("https://calendar.google.com/", "_blank");
    });

    // Logout
    document.getElementById("logout").addEventListener("click", () => {
        sessionStorage.removeItem("google_token");
        window.location.href = "login.html";
    });

});
