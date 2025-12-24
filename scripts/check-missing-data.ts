
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- CHECKING MISSING DATA ---');

    // Check Blog
    try {
        const blogCount = await prisma.blogPost.count();
        console.log(`Blog Posts: ${blogCount}`);
    } catch (e: any) {
        console.error("Blog Table Error:", e.message);
    }

    // Check FAQ
    try {
        const faqCount = await prisma.fAQ.count();
        console.log(`FAQs: ${faqCount}`);
    } catch (e: any) {
        console.error("FAQ Table Error:", e.message);
    }

    // Check Success Cases 
    try {
        const successCount = await prisma.successCase.count();
        console.log(`Success Cases: ${successCount}`);
    } catch (e: any) {
        console.error("SuccessCase Table Error:", e.message);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
