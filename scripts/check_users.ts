
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();

    const roleCounts = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    console.log('Role Counts:', roleCounts);

    const superAdmins = users.filter(u => u.role === 'SUPER_ADMIN');
    if (superAdmins.length > 0) {
        console.log('Found SUPER_ADMIN users:', superAdmins.map(u => ({ id: u.id, email: u.email })));
    } else {
        console.log('No SUPER_ADMIN users found.');
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
