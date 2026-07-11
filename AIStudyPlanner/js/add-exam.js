import { auth } from "./firebase.js";
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    // n8n webhook URL
    const N8N_WEBHOOK_URL = "https://n8ngc.codeblazar.org/webhook-test/add-exam";

    const examForm = document.getElementById("examForm");
    const statusMessage = document.getElementById("statusMessage");
    const saveButton = document.querySelector(".primary-btn");
    
    const timetableOutput = document.getElementById("timetableOutput");
    const timetableContent = document.getElementById("timetableContent");

    // Check if user is logged in
    onAuthStateChanged(auth, (user) => {

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        examForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const moduleName = document.getElementById("module").value.trim();
            const priority = document.getElementById("priority").value;
            const confidence = document.getElementById("confidence").value;
            const examDate = document.getElementById("examDate").value;
            const examTime = document.getElementById("examTime").value;
            const duration = document.getElementById("duration").value.trim();
            const venue = document.getElementById("venue").value.trim();
            const topics = document.getElementById("topics").value.trim();
            const notes = document.getElementById("notes").value.trim();

            // Validate required fields
            if (!moduleName || !priority || !confidence || !examDate || !examTime || !duration) {
                showStatus(
                    "Please fill in all required fields.",
                    "error"
                );
                return;
            }

            const examData = {
                uid: user.uid,
                studentName: user.displayName || "",
                studentEmail: user.email || "",
                module: moduleName,
                priority: priority,
                confidence: confidence,
                examDate: examDate,
                examTime: examTime,
                duration: duration,
                venue: venue,
                topics: topics,
                notes: notes,
                createdAt: new Date().toISOString()
            };

            try {

                // Clear previous timetable
                if (timetableOutput) timetableOutput.style.display = "none";

                // Disable button while sending data
                saveButton.disabled = true;

                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(examData)
                });

                if (!response.ok) {
                    throw new Error("Failed to save exam");
                }

                let result = {};

                try {
                    result = await response.json();
                } catch (e) {
                    console.log("No JSON response from n8n.");
                }

                // Display timetable if n8n returns one
                if (result.success && result.timetable && timetableOutput && timetableContent) {

                    showStatus(
                        result.message || "Exam saved successfully!",
                        "success"
                    );

                    timetableContent.innerText = result.timetable;
                    timetableOutput.style.display = "block";

                } else {

                    showStatus(
                        "Exam details logged, but timetable generation failed.",
                        "error"
                    );

                }

            } catch (error) {

                console.error(error);

                showStatus(
                    "Could not save exam. Please check your n8n workflow.",
                    "error"
                );

            } finally {

                saveButton.disabled = false;
                saveButton.textContent = "Save Exam";

            }
        });
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
    }
});

