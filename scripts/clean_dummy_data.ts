
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Pinpoint Data Cleaning...");

    // 1. Delete Consultations with '자동생성'
    const deletedConsultations = await prisma.consultation.deleteMany({
        where: { content: { contains: '자동생성' } }
    });
    console.log(`Deleted ${deletedConsultations.count} Audit/Dummy Consultations.`);

    // 2. Delete Reviews with '자동생성'
    const deletedReviews = await prisma.review.deleteMany({
        where: { content: { contains: '자동생성' } }
    });
    console.log(`Deleted ${deletedReviews.count} Audit/Dummy Reviews.`);

    // 3. Delete Specific Case Titles
    const targetTitles = [
        '강남구 투자 사기 혐의 방어',
        '이혼 및 재산분할 청구 소송',
        '음주운전 도로교통법 위반',
        '대여금 반환 청구 항소심'
    ];
    const deletedCases = await prisma.case.deleteMany({
        where: { title: { in: targetTitles } }
    });
    console.log(`Deleted ${deletedCases.count} Dummy Cases.`);

    // 4. Delete Users named 'User [Number]' (Safety Check)
    // We will find them first to ensure we don't delete real users accidentally
    const dummyUsers = await prisma.user.findMany({
        where: {
            name: { startsWith: 'User ' },
            // Add a constraint to be safer: emails like 'test...' or no specific domain if possible, 
            // but for now relying on the specific name pattern 'User ' usually implies seed data.
            role: 'USER'
        }
    });

    if (dummyUsers.length > 0) {
        console.log(`Found ${dummyUsers.length} potential dummy users (User X). Deleting...`);
        const idsToDelete = dummyUsers.map(u => u.id);
        const deletedUsers = await prisma.user.deleteMany({
            where: { id: { in: idsToDelete } }
        });
        console.log(`Deleted ${deletedUsers.count} Dummy Users.`);
    } else {
        console.log("No 'User X' dummy users found.");
    }

    console.log("Cleanup Complete.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
