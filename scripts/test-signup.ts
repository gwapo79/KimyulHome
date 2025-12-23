
import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Testing Signup Logic ---');
    const email = 'newuser@example.com';
    const password = 'password123';
    const name = 'New User';

    // 1. Check if exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('User already exists, deleting for test...');
        await prisma.user.delete({ where: { email } });
    }

    // 2. Simulate API logic (simplified)
    console.log('Creating user...');
    const user = await prisma.user.create({
        data: {
            email,
            password: 'hashed_password_simulation', // skipping bcrypt for quick DB test
            name,
            provider: 'local',
            phone: '010-1111-2222'
        }
    });

    console.log('✅ User created:', user.id);

    // 3. Verify persistence
    const check = await prisma.user.findUnique({ where: { email } });
    if (check) {
        console.log('✅ Persistence verified. User found in DB.');
    } else {
        console.error('❌ Persistence FAILED. User not found after create.');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
