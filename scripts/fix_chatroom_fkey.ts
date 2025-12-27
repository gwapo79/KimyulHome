
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("Checking for ChatRoom orphans...");

    // We need to use raw queries because the text schema might not match the DB exactly yet,
    // causing Prism errors if we use the model types directly if they changed.
    // But basic queries usually work. Let's try raw first for safety.

    try {
        // 1. Get all TeamMember IDs
        const teamMembers = await prisma.$queryRaw`SELECT id FROM "TeamMember"`;
        const teamMemberIds = new Set((teamMembers as any[]).map(t => t.id));
        console.log(`Found ${teamMemberIds.size} TeamMembers`);

        // 2. Get ChatRooms with non-null lawyerId
        const chatRooms = await prisma.$queryRaw`SELECT id, "lawyerId", title FROM "ChatRoom" WHERE "lawyerId" IS NOT NULL`;
        const orphans = (chatRooms as any[]).filter(c => !teamMemberIds.has(c.lawyerId));

        if (orphans.length === 0) {
            console.log("No orphaned ChatRooms found.");
            return;
        }

        console.log(`Found ${orphans.length} orphaned ChatRooms. Fixing...`);
        for (const orphan of orphans) {
            console.log(`- Fixing ChatRoom: ${orphan.title} (ID: ${orphan.id}, Invalid LawyerID: ${orphan.lawyerId})`);
            await prisma.$executeRaw`UPDATE "ChatRoom" SET "lawyerId" = NULL WHERE id = ${orphan.id}`;
        }
        console.log("All orphans fixed.");

    } catch (e) {
        console.error("Error fixing orphans:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
