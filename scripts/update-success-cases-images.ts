
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Success Case Image Update (Category Fallback)...");

    const cases = await prisma.successCase.findMany();

    // Counters
    let realEstateCount = 0;
    let financeCount = 0;
    let civilCount = 0;

    for (const c of cases) {
        let newImageUrl = "";

        // Category Mapping logic
        if (c.category === "부동산/임대차") {
            newImageUrl = "/images/success-cases/cat-real-estate.png";
            realEstateCount++;
        } else if (c.category === "금융/사기") {
            // Using the 'Neutral Lawyer Defense' image for Finance/Fraud
            newImageUrl = "/images/success-cases/cat-finance.png";
            financeCount++;
        } else {
            // Default to Civil (Handshake/Contract) for everything else
            newImageUrl = "/images/success-cases/cat-civil.png";
            civilCount++;
        }

        await prisma.successCase.update({
            where: { id: c.id },
            data: { imageUrl: newImageUrl }
        });
    }

    console.log(`Update Complete.`);
    console.log(`- Real Estate: ${realEstateCount}`);
    console.log(`- Finance/Fraud: ${financeCount}`);
    console.log(`- Other/Civil: ${civilCount}`);
    console.log(`Total: ${cases.length}`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
