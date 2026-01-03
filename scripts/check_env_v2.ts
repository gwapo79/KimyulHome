
import 'dotenv/config'; // Load .env file

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("CRITICAL: DATABASE_URL is not set.");
    process.exit(1);
}

// Mask the password
const maskedUrl = dbUrl.replace(/(:[^:@]+@)/, ':****@');

console.log(`Checking Database URL...`);

if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
    console.warn("WARNING: DATABASE_URL is pointing to localhost.");
} else if (dbUrl.includes("supabase.co") || dbUrl.includes("aws")) {
    console.log("SUCCESS: DATABASE_URL points to a remote cloud database.");
    if (dbUrl.includes("doariuqyrrwmtukimvbz")) {
        console.log("SUCCESS: Confirmed Project ID 'doariuqyrrwmtukimvbz' is present.");
    } else {
        console.warn("WARNING: Project ID 'doariuqyrrwmtukimvbz' NOT found in URL.");
    }
} else {
    console.log("INFO: URL format unrecognized (might be custom domain).");
}
