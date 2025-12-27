
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin1234!', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@lawfirm.com' },
        update: {},
        create: {
            email: 'admin@lawfirm.com',
            name: 'Super Admin',
            password,
            role: 'SUPER_ADMIN', // Make sure this matches your Enum
            provider: 'local',
        },
    })
    console.log({ admin })
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
