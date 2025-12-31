
import fetch from 'node-fetch';

async function main() {
    console.log("--- Testing Auth API (Live) ---");

    const baseUrl = 'http://localhost:3000';

    // 1. Test Default (No Cookie) -> Should be CEO
    try {
        const res1 = await fetch(`${baseUrl}/api/auth/me`);
        const data1: any = await res1.json();
        console.log(`[Default] User: ${data1.name}, Role: ${data1.role}`);

        if (data1.role !== 'CEO') console.error("FAIL: Default should be CEO");
        else console.log("PASS: Default is CEO");

    } catch (e) {
        console.error("Server seems down or API error:", e);
    }

    // 2. Test DEV Cookie
    try {
        const res2 = await fetch(`${baseUrl}/api/auth/me`, {
            headers: {
                cookie: 'MOCK_USER_EMAIL=dev@law-firm.com'
            }
        });
        const data2: any = await res2.json();
        console.log(`[DEV Cookie] User: ${data2.name}, Role: ${data2.role}`);

        if (data2.role !== 'DEV') console.error("FAIL: Cookie should switch to DEV");
        else console.log("PASS: Cookie switched to DEV");

    } catch (e) {
        console.error(e);
    }
}

main();
