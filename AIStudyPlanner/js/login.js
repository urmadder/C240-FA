const CLIENT_ID = "529281795879-6g91qb73fpo1527f4cap748r3aq4nq1n.apps.googleusercontent.com";

// 1. Called automatically when the Google JS script loads
window.initGoogleAuth = function () {
    console.log("Google JS Script initialized.");
    
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleLogin
    });

    const buttonContainer = document.getElementById("googleSignInBtn");
    
    if (buttonContainer) {
        google.accounts.id.renderButton(
            buttonContainer,
            { 
                theme: "outline", 
                size: "large", 
                text: "continue_with",
                shape: "rectangular",
                width: buttonContainer.offsetWidth || "100%" 
            }
        );
    } else {
        setTimeout(window.initGoogleAuth, 100);
    }
};

// 2. Helper function to decode the secure Google JWT Token
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

// 3. Handles the secure authentication token response
async function handleGoogleLogin(response) {
    if (!response.credential) {
        console.error("No credential returned from Google.");
        return;
    }

    try {
        const user = decodeJWT(response.credential);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "./dashboard.html";
        } else {
            alert("Could not process Google profile data. Try again.");
        }
    } catch (err) {
        console.error("Authentication process error:", err);
    }
}

// 4. Standard UI events (Password Toggle)
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

// 5. RACE CONDITION ANTIDOTE: 
// If Google script arrived first, 'google' exists but initGoogleAuth was never executed.
// We force it to fire right now.
if (typeof google !== "undefined" && google.accounts && google.accounts.id) {
    window.initGoogleAuth();
}