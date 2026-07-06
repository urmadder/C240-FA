// Check if the user is logged in
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

// Display welcome message
document.getElementById("welcomeMessage").innerHTML =
    `Welcome back, ${user.name} 👋`;

// Logout button
const logout = document.getElementById("logout");

logout.onclick = () => {

    // Remove user session
    localStorage.removeItem("user");

    // Return to login page
    window.location.href = "login.html";

};