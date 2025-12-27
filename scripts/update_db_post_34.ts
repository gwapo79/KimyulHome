
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const id = "55514983-5b95-4e17-a67d-c6195fa9b70b";
    const imageUrl = "/assets/images/blog/55514983_immunity_application.png";

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
