import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

// --- Configuration ---
const N8N_GENERATE_URL = "https://n8ngc.codeblazar.org/webhook-test/generate-timetable";

onAuthStateChanged(auth, (user) => {
    const welcomeMessage = document.getElementById("welcomeMessage");

    if (user) {
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${user.displayName || user.email} 👋`;
        }
    } else {
        window.location.href = "login.html";
    }
});

// --- UI Elements ---
const timetableBtn = document.getElementById("timetable");
const logoutBtn = document.getElementById("logout");
const generateBtn = document.getElementById("dashboardGenerateTimetableBtn");
const timetableOutput = document.getElementById("dashboardTimetableOutput");
const timetableContent = document.getElementById("dashboardTimetableContent");

// --- Navigation & Auth ---
if (timetableBtn) {
    timetableBtn.addEventListener("click", () => {
        window.location.href = "https://calendar.google.com/";
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        await signOut(auth);
        window.location.href = "login.html";
    });
}

// --- NEW: Generate Timetable Logic ---
if (generateBtn) {
    generateBtn.addEventListener("click", async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            // UI Feedback
            generateBtn.disabled = true;
            generateBtn.textContent = "AI is generating...";
            if (timetableOutput) timetableOutput.style.display = "none";

            // Call n8n to fetch from sheet & generate
            const response = await fetch(N8N_GENERATE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uid: user.uid,
                    email: user.email
                })
            });

            const result = await response.json();

            if (result.success && result.timetable) {
                timetableContent.innerText = result.timetable;
                timetableOutput.style.display = "block";
            } else {
                alert("Could not generate timetable. Ensure you have added exams first!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to the AI engine.");
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = "Generate Timetable";
        }
    });
}