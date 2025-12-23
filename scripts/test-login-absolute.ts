
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Testing Login Logic with Absolute Path...');
    const email = 'test';

    // Directly rely on the environment being loaded by tsx or the system
    // We won't manually set process.env.DATABASE_URL in this script's process if we can avoid it, 
    // but `npx tsx` loads .env automatically? No, `dotenv` is needed usually.
    // But our previous run used `$env:DATABASE_URL` in the command. 

    // We want to test if the code works assuming env is set.

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        console.log('✅ Found user:', user.email);
    } else {
        console.error('❌ User not found');
    }
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
