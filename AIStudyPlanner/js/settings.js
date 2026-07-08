document.addEventListener("DOMContentLoaded", () => {

    const profilePicture = document.getElementById("profilePicture");
    const displayName = document.getElementById("displayName");
    const email = document.getElementById("email");

    onAuthStateChanged(auth, (user) => {

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        profilePicture.src = user.photoURL || "https://via.placeholder.com/100";
        displayName.value = user.displayName || "";
        email.value = user.email || "";

    });

    // Theme code goes HERE
    const darkRadio = document.querySelector('input[value="dark"]');
    const lightRadio = document.querySelector('input[value="light"]');

    const savedTheme = localStorage.getItem("theme") || "dark";

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        lightRadio.checked = true;
    } else {
        darkRadio.checked = true;
    }

    darkRadio.addEventListener("change", () => {
        document.body.classList.remove("light-theme");
        localStorage.setItem("theme", "dark");
    });

    lightRadio.addEventListener("change", () => {
        document.body.classList.add("light-theme");
        localStorage.setItem("theme", "light");
    });

}); // <-- ONLY ONE closing });
