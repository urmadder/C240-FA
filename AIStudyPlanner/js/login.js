const http = require('http');
const https = require('https');

// 1. Paste your actual Google Client ID here
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'; 

const server = http.createServer((req, res) => {
    // Handle CORS preflight options request from browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // Check if it's our login route
    if (req.method === 'POST' && req.url === '/api/auth/google') {
        let body = '';

        // Read the incoming token data stream
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { token } = JSON.parse(body);
                if (!token) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, message: 'Missing token' }));
                }

                // 2. Securely check the token against Google's tokeninfo endpoint
                const googleUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`;
                
                https.get(googleUrl, (googleRes) => {
                    let googleData = '';
                    googleRes.on('data', d => { googleData += d; });
                    googleRes.on('end', () => {
                        const payload = JSON.parse(googleData);

                        // 3. Verify the token belongs to your app (aud matches Client ID)
                        if (payload.aud === CLIENT_ID) {
                            console.log(`Verified user: ${payload.name} (${payload.email})`);
                            
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({
                                success: true,
                                user: { name: payload.name, email: payload.email }
                            }));
                        } else {
                            console.log("Token verification failed: Client ID mismatch or invalid token.");
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Invalid token signature' }));
                        }
                    });
                }).on('error', (e) => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Internal server error' }));
                });

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Invalid JSON body' }));
            }
        });
    } else {
        // Handle 404 for any other endpoints
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

// Run the server on port 5000
server.listen(5000, () => {
    console.log('Pure Node.js auth server running on http://localhost:5000');
});