
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'test_user@example.com' },
        include: {
            cases: true
        }
    });

    if (!user) {
        console.log("User not found");
        return;
    }

    console.log(`User: ${user.email} has ${user.cases.length} cases.`);

    for (const c of user.cases) {
        console.log(`\nCase: ${c.title} (${c.id})`);
        console.log(`- claimAmount:`, c.claimAmount, `(type: ${typeof c.claimAmount})`);
        console.log(`- timelineJson type:`, typeof c.timelineJson);
        console.log(`- timelineJson value:`, c.timelineJson);

        if (typeof c.timelineJson === 'string') {
            console.log("WARNING: timelineJson is a string! It should be likely be an object/array in Prisma.");
        }

        if (c.timelineJson && typeof c.timelineJson === 'object') {
            console.log("timelineJson is an object/array as expected.");
            console.log("Is array?", Array.isArray(c.timelineJson));
        }
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
