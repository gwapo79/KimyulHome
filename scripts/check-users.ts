
import { prisma } from '../lib/prisma';

async function main() {
    console.log('--- Checking Database Users ---');
    // Need to ensure we use the same env as the app, but effectively verifying the file content.
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users:`);
    users.forEach((u) => {
        console.log(`- Email: ${u.email}, Provider: ${u.provider}, ID: ${u.id}, PasswordSet: ${!!u.password}`);
    });
    console.log('-------------------------------');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
