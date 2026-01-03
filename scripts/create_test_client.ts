
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log("👤 Creating Test Client Account...");

    const email = 'client@test.com';
    const password = '1234';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'USER',
            name: '홍길동',
            status: 'ACTIVE'
        },
        create: {
            email,
            password: hashedPassword,
            name: '홍길동',
            role: 'USER',
            provider: 'local',
            status: 'ACTIVE'
        }
    });

    console.log(`✅ Test Client created: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
