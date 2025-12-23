
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'test';
    const password = '1234';

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        console.log('Test user already exists');
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
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
