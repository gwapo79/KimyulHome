
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

async function main() {
    const email = 'admin@kimyul.com';
    const password = await hash('admin1234', 12);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'SUPER_ADMIN',
            password,
        },
        create: {
            email,
            name: '관리자',
            password,
            role: 'SUPER_ADMIN',
            phone: '010-0000-0000',
        },
    });

    console.log(`Admin user upserted: ${user.email} with role ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
