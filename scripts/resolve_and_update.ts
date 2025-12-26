
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

function extractTitleFromPrompt(prompt: string): string {
    // Expected: "Professional candid photo of [TITLE] related scene..."
    const match = prompt.match(/Professional candid photo of (.*?) related scene/);
    if (match && match[1]) return match[1].trim();
    // Fallback?
    return "";
}

async function main() {
    const args = process.argv.slice(2);
    const id = args[0];
    const imagePath = args[1];
    const prompt = args[2] || "";

    console.log(`Resolving ID: ${id}`);

    // 1. Try Direct ID Update
    try {
        await prisma.successCase.update({
            where: { id: id },
            data: { imageUrl: imagePath }
        });
        console.log("Updated via ID Match.");
        return;
    } catch (e) {
        console.log("Direct ID update failed. Trying title match...");
    }

    // 2. Try Title Match
    const titlePart = extractTitleFromPrompt(prompt);
    if (!titlePart) {
        console.error("Could not extract title from prompt.");
        return;
    }

    console.log(`Searching for title containing: '${titlePart}'`);
    const found = await prisma.successCase.findFirst({
        where: {
            title: { contains: titlePart }
        }
    });

    if (found) {
        console.log(`Found matching case: ${found.id} (${found.title})`);
        await prisma.successCase.update({
            where: { id: found.id },
            data: { imageUrl: imagePath }
        });
        console.log("Updated via Title Match.");
    } else {
        console.error("No case found by title either. Skipping DB update.");
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
