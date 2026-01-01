
import { prisma } from '@/lib/prisma';

async function main() {
    const email = 'admin@kimyul.com';
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.log(`User ${email} not found.`);
    } else {
        console.log(`User: ${user.email}, Role: ${user.role}, Name: ${user.name}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
