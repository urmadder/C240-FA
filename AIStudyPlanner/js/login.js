const CLIENT_ID = "529281795879-6g91qb73fpo1527f4cap748r3aq4nq1n.apps.googleusercontent.com";
let tokenClient;

// 1. Explicitly attach it to the global window object so Google can find it!
window.initGoogleAuth = function() {
    console.log("Google library triggered initGoogleAuth successfully.");
    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: "openid email profile",
            callback: handleGoogleLogin
        });
    } catch (err) {
        console.error("Failed to initialize Google client:", err);
    }
};

// Attach event listeners safely once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Google Sign-In Button
    const googleBtn = document.getElementById("googleSignInBtn");
    if (googleBtn) {
        googleBtn.addEventListener("click", () => {
            if (!tokenClient) {
                alert("Google Auth is still loading. Please try again in a moment.");
                return;
            }
            tokenClient.requestAccessToken();
        });
    }

    // Password Toggle Feature
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

// Handle the login response
async function handleGoogleLogin(response) {
    if (response.error) {
        console.error("Google Login Error:", response.error);
        return;
    }

    try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${response.access_token}`
            }
        });

        if (!res.ok) throw new Error("Failed to fetch user info from Google");

        const user = await res.json();
        
        // Save to local storage and redirect
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "./dashboard.html";

    } catch (err) {
        console.error("Authentication failed:", err);
    }
}