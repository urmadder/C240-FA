const CLIENT_ID = "529281795879-6g91qb73fpo1527f4cap748r3aq4nq1n.apps.googleusercontent.com";

// 1. Called automatically when the Google JS script loads
window.initGoogleAuth = function () {
    // Initialize the official sign-in client
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleLogin // Matches the success handler below
    });

    // Render the secure official button inside your container
    google.accounts.id.renderButton(
        document.getElementById("googleSignInBtn"),
        { 
            theme: "outline", 
            size: "large", 
            text: "continue_with",
            shape: "rectangular",
            width: "100%" // Auto-stretches to match your form width
        }
    );
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
        // Decode the secure credential token into user profile data
        const user = decodeJWT(response.credential);
        
        if (user) {
            console.log("Authenticated User Object:", user);
            
            // Save the profile object to localStorage for dashboard use
            localStorage.setItem("user", JSON.stringify(user));
            
            // Move safely to the dashboard
            window.location.href = "./dashboard.html";
        } else {
            alert("Could not process Google profile data. Try again.");
        }
    } catch (err) {
        console.error("Authentication process error:", err);
    }
}

// 4. Standard UI events (Password Toggle, Form Submit, etc.)
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