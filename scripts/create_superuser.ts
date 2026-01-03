
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log("🔐 Creating Super Admin Account...");

    const email = 'admin@lawfirm.com';
    const password = '1234';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'SUPER_ADMIN',
            name: '최고관리자',
            status: 'ACTIVE'
        },
        create: {
            email,
            password: hashedPassword,
            name: '최고관리자',
            role: 'SUPER_ADMIN',
            provider: 'local',
            status: 'ACTIVE'
        }
    });

    console.log(`✅ Super Admin created/updated: ${user.email} (Role: ${user.role})`);
    console.log(`🔑 Login with: ${email} / ${password}`);
}

main()
    .catch((e) => {
        console.error("❌ Error creating admin:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
