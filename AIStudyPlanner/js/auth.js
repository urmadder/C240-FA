const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

if (toggle) {
    toggle.onclick = () => {
        if (password.type === "password") {
            password.type = "text";
            toggle.innerHTML = "🙈";
        } else {
            password.type = "password";
            toggle.innerHTML = "👁";
        }
    };
}

const form = document.getElementById("loginForm");

if (form) {
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        // Temporary login (for frontend demo)
        localStorage.setItem("loggedIn", "true");

        window.location.href = "dashboard.html";
    });
}