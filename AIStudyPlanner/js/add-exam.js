document.addEventListener("DOMContentLoaded", () => {
    // Replace this with your real n8n webhook URL
    const N8N_WEBHOOK_URL = "https://YOUR-N8N-DOMAIN/webhook/add-exam";

    const token = sessionStorage.getItem("google_token");

    // Protect page
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

    const examForm = document.getElementById("examForm");
    const statusMessage = document.getElementById("statusMessage");
    const saveButton = document.querySelector(".primary-btn");
    const logoutButton = document.getElementById("logout");

    let studentId = localStorage.getItem("studentId");

    if (!studentId) {
        if (user && user.email) {
            studentId = user.email;
        } else {
            studentId = "student_" + Date.now();
        }

        localStorage.setItem("studentId", studentId);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            sessionStorage.removeItem("google_token");
            window.location.href = "login.html";
        });
    }

    examForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const moduleName = document.getElementById("module").value.trim();
        const priority = document.getElementById("priority").value;
        const examDate = document.getElementById("examDate").value;
        const examTime = document.getElementById("examTime").value;
        const duration = document.getElementById("duration").value.trim();
        const venue = document.getElementById("venue").value.trim();
        const topics = document.getElementById("topics").value.trim();
        const notes = document.getElementById("notes").value.trim();

        if (!moduleName || !priority || !examDate || !examTime || !duration) {
            showStatus("Please fill in all required fields.", "error");
            return;
        }

        const examData = {
            studentId: studentId,
            studentName: user?.name || "",
            studentEmail: user?.email || "",
            module: moduleName,
            priority: priority,
            examDate: examDate,
            examTime: examTime,
            duration: duration,
            venue: venue,
            topics: topics,
            notes: notes,
            createdAt: new Date().toISOString()
        };

        try {
            showStatus("Saving exam...", "loading");
            saveButton.disabled = true;
            saveButton.textContent = "Saving...";

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

            const result = await response.json();

            showStatus(result.message || "Exam saved successfully.", "success");

            examForm.reset();

        } catch (error) {
            console.error(error);
            showStatus("Could not save exam. Check your n8n webhook URL or workflow.", "error");
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Save Exam";
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
    }
});
