import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@law-firm.com';
    const password = 'admin1234';

    // Hash generator
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`[INJECTION] Injecting User: ${email}`);

    // Upsert guarantees it exists with these exact values
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            name: '최고관리자',
            provider: 'local'
        },
        create: {
            email,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            name: '최고관리자',
            provider: 'local'
        }
    });

    console.log("---------------------------------------------------");
    console.log("[VERIFICATION] Raw DB Output:");
    console.log(JSON.stringify(user, null, 2));
    console.log("---------------------------------------------------");
    console.log(`Password Match Test (admin1234): ${await bcrypt.compare(password, user.password!)}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
