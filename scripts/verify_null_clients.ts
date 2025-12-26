
import { prisma } from '@/lib/prisma';

async function check() {
    const total = await prisma.successCase.count();
    const nullClients = await prisma.successCase.count({ where: { client: null } });
    const emptyClients = await prisma.successCase.count({ where: { client: '' } });

    console.log(`Total: ${total}`);
    console.log(`Null Clients: ${nullClients}`);
    console.log(`Empty Clients: ${emptyClients}`);
}

check().catch(console.error).finally(() => prisma.$disconnect());
