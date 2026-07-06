const CLIENT_ID = "529281795879-6g91qb73fpo1527f4cap748r3aq4nq1n.apps.googleusercontent.com";

window.onload = () => {

    google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: "openid email profile",
        callback: async (response) => {

            if (response.error) {
                console.error(response);
                return;
            }

            // Get the user's profile
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

            // Save user details
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("userPicture", user.picture);

            // Redirect
            window.location.href = "dashboard.html";

        }
    });

    document.getElementById("googleSignInBtn").onclick = () => {

        google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: "openid email profile",
            callback: async (response) => {

                if (response.error) return;

                const res = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${response.access_token}`
                        }
                    }
                );

                const user = await res.json();

                localStorage.setItem("userName", user.name);
                localStorage.setItem("userEmail", user.email);
                localStorage.setItem("userPicture", user.picture);

                window.location.href = "dashboard.html";

            }
        }).requestAccessToken();

    };

};