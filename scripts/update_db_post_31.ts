
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const id = "70411062-5654-42d2-8fdc-575ff8a9d342";
    const imageUrl = "/assets/images/blog/70411062_public_defender.png";

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
