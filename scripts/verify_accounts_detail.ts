
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("--- Verifying User Accounts & Roles ---");

    const users = await prisma.user.findMany({
        select: {
            email: true,
            role: true,
            name: true
        }
    });

    console.log(`Total Users Found: ${users.length}`);

    const rolesFound = {
        CEO: users.filter(u => u.role === 'CEO'),
        DEV: users.filter(u => u.role === 'DEV'),
        LAWYER: users.filter(u => u.role === 'LAWYER'),
        STAFF: users.filter(u => u.role === 'STAFF'),
        USER: users.filter(u => u.role === 'USER'),
    };

    console.log("\n[CEO Accounts]:", rolesFound.CEO.map(u => u.email));
    console.log("[DEV Accounts]:", rolesFound.DEV.map(u => u.email));
    console.log("[LAWYER Accounts]:", rolesFound.LAWYER.map(u => u.email));
    console.log("[STAFF Accounts]:", rolesFound.STAFF.map(u => u.email));

    // Check specifically for what might be the "4 test accounts"
    // Assuming standard naming or verifying against the user's implicit list.

    /*
    If any vital role is missing, we might want to create a dummy one for testing.
    */
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
