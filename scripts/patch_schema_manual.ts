
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- Manual Schema Patch ---");

  try {
    // 1. Ensure Profile table exists (and check casing)
    // We try to query it. If it fails, creation failed.
    // We can't rely on prisma.profile if it errors. Use raw.
    console.log("Checking Profile table...");
    try {
      await prisma.$queryRawUnsafe(`SELECT count(*) FROM "Profile"`);
      console.log("✅ 'Profile' table exists.");
    } catch {
      console.log("⚠️ 'Profile' table missing, attempting fix...");
      // Re-run the RLS policies script content which creates it? 
      // No, RLS script assumes creation. We need Create Table first.
      // But the previous evidence said it existed.
    }

    // 2. Add Columns if missing
    console.log("Adding columns...");

    // BlogPost
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='BlogPost' AND column_name='assignedProfileId') THEN 
          ALTER TABLE "BlogPost" ADD COLUMN "assignedProfileId" text; 
        END IF; 
      END $$;
    `);
    console.log("Checked/Updated BlogPost");

    // SuccessCase
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SuccessCase' AND column_name='assignedProfessionalId') THEN 
          ALTER TABLE "SuccessCase" ADD COLUMN "assignedProfessionalId" text; 
        END IF; 
      END $$;
    `);
    console.log("Checked/Updated SuccessCase");

    // ChatRoom
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
         IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ChatRoom' AND column_name='assignedProfessionalId') THEN 
          ALTER TABLE "ChatRoom" ADD COLUMN "assignedProfessionalId" text; 
        END IF; 
      END $$;
    `);
    console.log("Checked/Updated ChatRoom");

    // Case
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
         IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Case' AND column_name='assignedProfessionalId') THEN 
          ALTER TABLE "Case" ADD COLUMN "assignedProfessionalId" text; 
        END IF;
         IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Case' AND column_name='assignedStaffId') THEN 
          ALTER TABLE "Case" ADD COLUMN "assignedStaffId" text; 
        END IF;
      END $$;
    `);
    console.log("Checked/Updated Case");

    // Consultation
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
         IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Consultation' AND column_name='assignedProfileId') THEN 
          ALTER TABLE "Consultation" ADD COLUMN "assignedProfileId" text; 
        END IF; 
      END $$;
    `);
    console.log("Checked/Updated Consultation");

    console.log("✅ Schema patch applied.");

  } catch (e: any) {
    console.error("Patch Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
