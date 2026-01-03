
import { prisma } from '../lib/prisma';

async function main() {
    const email = 'admin@petkage.com';
    console.log(`[VERIFICATION] Querying DB for: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            role: true,
            name: true,
            provider: true,
            createdAt: true
        }
    });

    if (!user) {
        console.log('[ERROR] User not found!');
    } else {
        console.log('--------------------------------------------------');
        console.log('User Record Found:');
        console.log(`ID: ${user.id}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Provider: ${user.provider}`);
        console.log('--------------------------------------------------');

        if (user.role === 'SUPER_ADMIN') {
            console.log('CONFIRMED: Database Role is SUPER_ADMIN');
        } else {
            console.log(`WARNING: Database Role is ${user.role} (Expected SUPER_ADMIN)`);
        }
    }

    // Also check if there's any other admin user just in case
    const allAdmins = await prisma.user.findMany({
        where: { role: 'SUPER_ADMIN' },
        select: { email: true }
    });
    console.log('All SUPER_ADMINs in DB:', allAdmins.map(u => u.email));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
