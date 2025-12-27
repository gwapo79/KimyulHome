
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const id = "92275685-4747-4646-834e-def0d69bb08f";
    const imageUrl = "/assets/images/blog/92275685_contract_refusal.png";

    console.log(`Updating Post ${id} with image ${imageUrl}`);

    try {
        await prisma.blogPost.update({
            where: { id: id },
            data: { thumbnailUrl: imageUrl }
        });
        console.log("Update Success");
    } catch (e) {
        console.error("Update Failed", e);
        process.exit(1);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
