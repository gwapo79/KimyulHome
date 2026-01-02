
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Manual Schema Patch: Profile Fields ---");

    try {
        const columns = ['position', 'specialty', 'description'];

        for (const col of columns) {
            await prisma.$executeRawUnsafe(`
          DO $$ 
          BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Profile' AND column_name='${col}') THEN 
              ALTER TABLE "Profile" ADD COLUMN "${col}" text; 
              RAISE NOTICE 'Added column %', '${col}';
            END IF; 
          END $$;
        `);
        }

        console.log("✅ Profile schema patched.");

    } catch (e: any) {
        console.error("Patch Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
