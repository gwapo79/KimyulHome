
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("--- Seeding Test Users ---");

    const passwordHash = await bcrypt.hash('1234', 10); // Standard test password

    const users = [
        { email: 'admin@law-firm.com', role: 'CEO', name: '김지율 CEO' },
        { email: 'dev@law-firm.com', role: 'DEV', name: '박개발 테스터' },
        { email: 'lawyer@law-firm.com', role: 'LAWYER', name: '이변호 변호사' },
        { email: 'staff@law-firm.com', role: 'STAFF', name: '정실무 과장' }
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                role: u.role as Role,
                name: u.name
            },
            create: {
                email: u.email,
                role: u.role as Role,
                name: u.name,
                password: passwordHash,
                // Add required fields if any. Schema showed created_at/updated_at default.
            }
        });
        console.log(`Upserted ${u.role}: ${u.email}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
