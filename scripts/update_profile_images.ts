
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const updates = [
        { name: '김율', file: 'kim-yul.png' }, // Also check '김지율' if needed
        { name: '김지율', file: 'kim-yul.png' },
        { name: '박선영', file: 'park-sun-young.png' },
        { name: '최은아', file: 'choi-eun-ah.png' },
        { name: '이서준', file: 'lee-seo-jun.png' },
    ];

    for (const u of updates) {
        const profile = await prisma.profile.findFirst({
            where: { name: u.name }
        });

        if (profile) {
            console.log(`Updating ${u.name}...`);
            await prisma.profile.update({
                where: { id: profile.id },
                data: { avatarUrl: `/images/lawyers/${u.file}?v=2` }
            });
        } else {
            console.log(`Profile ${u.name} not found.`);
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
