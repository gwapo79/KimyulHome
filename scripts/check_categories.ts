
import { prisma } from '@/lib/prisma';

async function main() {
    const cases = await prisma.successCase.groupBy({
        by: ['category'],
        _count: {
            category: true
        }
    });

    console.log("📊 Distinct Categories found in DB:");
    if (cases.length === 0) {
        console.log("No cases found.");
    }
    cases.forEach(c => {
        console.log(`- "${c.category}": ${c._count.category} items`);
    });
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
