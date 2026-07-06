// 1. Helper function to decode the secure Google JWT Token
function decodeJWT(token) {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to parse JWT:", e);
        return null;
    }
}

// 2. This exact function matches the data-callback="handleGoogleLogin" in your HTML
window.handleGoogleLogin = async function (response) {
    console.log("Google Login Token Received!");

    if (!response.credential) {
        console.error("No credential returned from Google.");
        return;
    }

    try {
        const user = decodeJWT(response.credential);
        
        if (user) {
            console.log("Authenticated User Object:", user);
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "./dashboard.html";
        } else {
            alert("Could not process Google profile data. Try again.");
        }
    } catch (err) {
        console.error("Authentication process error:", err);
    }
}

// 3. Standard UI events (Password Toggle)
document.addEventListener("DOMContentLoaded", () => {
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            togglePassword.textContent = type === "password" ? "👁️" : "🙈";
        });
    }
});