
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany({ select: { email: true, name: true } });
        console.log("Users available:");
        users.forEach(u => console.log(`- ${u.email} (${u.name}) [Role: ${u.role}]`));
    } catch (e) {
        console.error("Error fetching users:", e);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
