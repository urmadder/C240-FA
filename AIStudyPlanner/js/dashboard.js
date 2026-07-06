

const logout = document.getElementById("logout");

logout.onclick = () => {

localStorage.removeItem("loggedIn");

window.location.href = "login.html";

}