
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const id = "34af265e-df4c-4f21-970a-a2b4d1bb6510";
    const imageUrl = "/assets/images/blog/34af265e_floor_noise.png";

    // Safety check that file exists

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
