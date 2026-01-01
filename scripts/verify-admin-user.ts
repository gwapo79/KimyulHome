
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("--- Checking Admin User Existence ---");
    const email = 'admin@law-firm.com';
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (user) {
        console.log(`[FOUND] Admin user exists: ${user.email} (Role: ${user.role})`);
        console.log(`Password Hash starts with: ${user.password ? user.password.substring(0, 10) : 'NULL'}`);
    } else {
        console.log("[ERROR] Admin user NOT found in this database.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
