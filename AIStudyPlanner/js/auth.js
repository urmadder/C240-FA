function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch (e) {
        return null;
    }
}

/* 🔐 Protect page + return user */
function protectPage() {
    const token = sessionStorage.getItem("google_token");

    if (!token) {
        window.location.href = "login.html";
        return null;
    }

    const payload = parseJwt(token);

    if (!payload) {
        sessionStorage.removeItem("google_token");
        window.location.href = "login.html";
        return null;
    }

    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
        sessionStorage.removeItem("google_token");
        window.location.href = "login.html";
        return null;
    }

    return payload;
}