
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Find a case that likely needs an image (e.g. not having a unique path or just take the first one)
    // We'll just take the first one from the DB to be sure it exists.
    const item = await prisma.successCase.findFirst({
        orderBy: { createdAt: 'desc' } // or just whatever
    });

    if (!item) {
        console.log("No cases found in DB.");
        return;
    }

    console.log("TARGET_ITEM_ID:", item.id);
    console.log("TARGET_ITEM_TITLE:", item.title);
    console.log("TARGET_ITEM_CATEGORY:", item.category);
    // Suggest a prompt base
    console.log(`SUGGESTED_PROMPT_BASE: Amateur photo related to ${item.title}. Context: ${item.category}.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
