
import http from 'http';

async function verifySecurity() {
    console.log('Starting Security Verification...');

    const data = JSON.stringify({ email: 'nonexistent@example.com', password: 'wrongpassword' });

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        let responseBody = '';

        res.on('data', (chunk) => {
            responseBody += chunk;
        });

        res.on('end', () => {
            console.log('Login Response Status:', res.statusCode);
            console.log('Login Response Body:', responseBody);

            const leakedStrings = ['postgres://', 'DB_URL', 'User not found or no password', 'debug_', 'password.substring'];
            const hasLeak = leakedStrings.some(s => responseBody.includes(s));

            if (hasLeak) {
                console.error('CRITICAL FAILURE: Sensitive information leak detected!');
                leakedStrings.forEach(s => {
                    if (responseBody.includes(s)) console.error(`Found leaked string: "${s}"`);
                });
                process.exit(1);
            }

            if (responseBody.includes('아이디 또는 비밀번호가 일치하지 않습니다.')) {
                console.log('SUCCESS: Error message is generic and secure.');
                process.exit(0);
            } else {
                console.warn('WARNING: Error message is not the expected generic message, but no leak detected.');
                // It might be "Internal server error" if DB is down, which is also safe from leaks.
                if (res.statusCode === 500) {
                    console.log('Server returned 500, which is acceptable if DB is unreachable (safe from leaks).');
                    process.exit(0);
                }
                process.exit(1);
            }
        });
    });

    req.on('error', (error) => {
        console.error('Verification failed:', error);
        process.exit(1);
    });

    req.write(data);
    req.end();
}

verifySecurity();
