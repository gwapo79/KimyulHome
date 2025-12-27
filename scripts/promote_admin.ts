
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error("Usage: npx tsx scripts/promote_admin.ts <email>");
        process.exit(1);
    }

    console.log(`Promoting user ${email} to SUPER_ADMIN...`);

    try {
        // Need to use explicit update because types might not be generated yet if generate failed.
        // Prisma Client might fail if 'role' column doesn't exist in DB yet.
        const user = await prisma.user.update({
            where: { email },
            data: {
                // @ts-ignore
                role: 'SUPER_ADMIN'
            }
        });
        console.log(`Success! User ${user.name} (${user.email}) is now SUPER_ADMIN.`);
    } catch (e) {
        console.error("Error promoting user:", e);
        console.log("Hint: Did you run 'npx prisma db push' to add the 'role' column?");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
