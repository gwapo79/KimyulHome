
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("CRITICAL: DATABASE_URL is not set.");
    process.exit(1);
}

if (dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")) {
    console.warn("WARNING: DATABASE_URL is pointing to localhost. This might not be Production Supabase.");
    console.log("Current host in URL:", dbUrl.split('@')[1].split(':')[0]);
} else if (dbUrl.includes("supabase.co") || dbUrl.includes("aws")) {
    console.log("SUCCESS: DATABASE_URL appears to trigger a remote Supabase/Cloud database.");
    console.log("Host snippet:", dbUrl.split('@')[1].split('.')[0]); // Safe log
} else {
    console.log("INFO: Database URL is set but not recognized as standard Supabase/Localhost.");
}
