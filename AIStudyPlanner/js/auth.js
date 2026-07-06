function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
}

function protectPage() {
    const token = sessionStorage.getItem("google_token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const payload = parseJwt(token);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
        sessionStorage.removeItem("google_token");
        window.location.href = "login.html";
    }
}