
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Testing Login Logic with Absolute Path...');
    const email = 'test';
    const password = '1234';

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
        console.log('✅ Found user:', user.email);

        if (user.password) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid) {
                console.log('✅ Password verification successful');
            } else {
                console.error('❌ Password verification failed');
            }
        } else {
            console.error('❌ User has no password set');
        }
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
