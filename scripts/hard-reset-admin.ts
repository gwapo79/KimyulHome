import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@law-firm.com';
    const password = 'admin1234';

    console.log(`[HARD RESET] Target: ${email}`);

    // 1. DELETE if exists
    try {
        await prisma.user.delete({
            where: { email }
        });
        console.log("🗑  Deleted existing user.");
    } catch (e) {
        console.log("ℹ️  User did not exist (or verify failed), proceeding to create.");
    }

    // 2. CREATE fresh
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: 'Super Admin (Reset)',
            role: Role.SUPER_ADMIN,
            provider: 'local',
        }
    });

    console.log(`✅ Created fresh user: ${user.id}`);
    console.log(`🔑 Password Hash: ${user.password}`);

    // 3. Verify immediately
    const check = await bcrypt.compare(password, user.password!);
    console.log(`🛡  Immediate Hash Check: ${check ? 'PASS' : 'FAIL'}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
