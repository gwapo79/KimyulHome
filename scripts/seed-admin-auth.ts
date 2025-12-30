import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@law-firm.com';
    const password = 'admin1234';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            role: Role.SUPER_ADMIN,
            provider: 'local',
        },
    });

    console.log(`[SUCCESS] Admin User Seeded: ${user.email} / role: ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
