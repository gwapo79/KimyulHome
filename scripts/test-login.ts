
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Testing Login Logic...');
    const email = 'test';
    const password = '1234';

    console.log(`Searching for user: ${email}`);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error('❌ User not found!');
        return;
    }
    console.log('✅ User found:', user.id);

    if (!user.password) {
        console.error('❌ User has no password set!');
        return;
    }

    console.log('Verifying password...');
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
        console.log('✅ Password matched! Login successful logic verification passed.');
    } else {
        console.error('❌ Password did NOT match.');
        console.log('Stored hash:', user.password);

        const newHash = await bcrypt.hash(password, 10);
        console.log('Expected hash format example:', newHash);
    }
}

main()
    .catch((e) => {
        console.error('❌ Script verification failed:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
