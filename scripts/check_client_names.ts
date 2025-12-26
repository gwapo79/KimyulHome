
import { prisma } from '@/lib/prisma';

async function checkClients() {
    const cases = await prisma.successCase.findMany({
        select: { id: true, title: true, client: true }
    });
    console.log('Total cases:', cases.length);
    const nullClients = cases.filter(c => !c.client);
    console.log('Cases with null client:', nullClients.length);
    console.log('Sample clients:', cases.slice(0, 5).map(c => c.client));
}

checkClients()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
