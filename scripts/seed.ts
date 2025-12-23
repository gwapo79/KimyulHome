
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    const email = 'test';
    const password = '1234';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: { password: hashedPassword },
        create: {
            email,
            password: hashedPassword,
            name: 'Test User',
            phone: '010-0000-0000',
            provider: 'local',
        },
    });

    console.log('Test user created successfully:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
