
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Starting DB Verification ---");

    try {
        // 1. Verify Project Reference from Env (Masked)
        const dbUrl = process.env.DATABASE_URL || "";
        const projectRef = dbUrl.match(/postgres:\/\/postgres\.([^:]+)/)?.[1] || "Unknown";
        console.log(`Target Supabase Project ID: ${projectRef}`);

        // 2. List all tables in public schema using Unsafe to bypass template tag issues
        console.log("Querying information_schema.tables...");
        const tables: any[] = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        const tableNames = tables.map((t: any) => t.table_name);
        console.log("Tables found in 'public' schema:", tableNames);

        // 3. Specific check for Profile
        if (tableNames.includes('Profile')) {
            console.log("✅ SUCCESS: 'Profile' table was found.");

            // 4. Try a direct select to confirm accessibility
            const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "Profile" LIMIT 1`);
            console.log("SELECT * FROM \"Profile\" result:", rows);
        } else {
            console.error("❌ FAILURE: 'Profile' table is MISSING in the database.");
        }

    } catch (e) {
        console.error("Error during verification:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
