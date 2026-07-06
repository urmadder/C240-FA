const http = require('http');
const https = require('https');

// The backend hardcodes the client ID so attackers can't spoof the audience ('aud') target
const CLIENT_ID = '529281795879-6g91qb73fpo1527f4cap748r3aq4nq1n.apps.googleusercontent.com'; 

const server = http.createServer((req, res) => {
    // Handle CORS rules so your frontend can communicate with this backend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // Process the authentication token route
    if (req.method === 'POST' && req.url === '/api/auth/google') {
        let body = '';

        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { token } = JSON.parse(body);
                if (!token) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, message: 'Missing token' }));
                }

                // Verify the token by calling Google's secure server-to-server validation API
                const googleUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`;
                
                https.get(googleUrl, (googleRes) => {
                    let googleData = '';
                    googleRes.on('data', d => { googleData += d; });
                    googleRes.on('end', () => {
                        try {
                            const payload = JSON.parse(googleData);

                            // CRITICAL SECURITY CHECK: Ensure the token was explicitly made for YOUR application
                            if (payload.aud === CLIENT_ID) {
                                console.log(`[AUTH SUCCESS] Verified identity for: ${payload.email}`);
                                
                                // In a production app, you would generate a secure HTTP-Only session cookie here.
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({
                                    success: true,
                                    user: { name: payload.name, email: payload.email }
                                }));
                            } else {
                                console.warn(`[SECURITY ALERT] Token audience mismatch! Expected ${CLIENT_ID}, got ${payload.aud}`);
                                res.writeHead(401, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ success: false, message: 'Invalid token audience target.' }));
                            }
                        } catch (parseErr) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Failed to process authentication server response' }));
                        }
                    });
                }).on('error', (e) => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Internal server communication error' }));
                });

            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Bad request payload' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Resource Not Found' }));
    }
});

server.listen(5000, () => {
    console.log('Secure Authentication Server running on http://localhost:5000');
});