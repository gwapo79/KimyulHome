
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const profiles = await prisma.profile.findMany();
    console.log(JSON.stringify(profiles, null, 2));
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
