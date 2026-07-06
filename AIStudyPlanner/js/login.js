const CLIENT_ID = "529281795879-6g91qb73fpo1527f4cap748r3aq4nq1n.apps.googleusercontent.com";

let tokenClient;

window.onload = () => {

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: "openid email profile",
        callback: handleGoogleLogin
    });

    document
        .getElementById("googleSignInBtn")
        .addEventListener("click", () => {

            tokenClient.requestAccessToken();

        });

};

async function handleGoogleLogin(response) {

    if (response.error) {
        console.error(response);
        return;
    }

    try {

        const res = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${response.access_token}`
                }
            }
        );

        const user = await res.json();

        console.log(user);

        localStorage.setItem("user", JSON.stringify(user));

        window.location.href = "dashboard.html";

    }
    catch (err) {

        console.error(err);

    }

}