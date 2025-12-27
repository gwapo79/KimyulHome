
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const id = "c0f3237e-c06c-4543-8eca-491c636bf15f";
    const imageUrl = "/assets/images/blog/c0f3237e_spouse_property.png";

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
