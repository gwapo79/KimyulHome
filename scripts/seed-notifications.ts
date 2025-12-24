
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding notification settings...');

    const email = 'test_user@example.com';
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error(`User ${email} not found.`);
        return;
    }

    // Upsert Settings (Enable All)
    const settings = await prisma.notificationSetting.upsert({
        where: { userId: user.id },
        update: {
            caseUpdateEmail: true,
            caseUpdateSms: true,
            scheduleReminder: true,
            marketingAgree: true,
        },
        create: {
            userId: user.id,
            caseUpdateEmail: true,
            caseUpdateSms: true,
            scheduleReminder: true,
            marketingAgree: true,
        },
    });

    console.log(`Updated notification settings for ${user.name} (${user.id}):`, settings);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
