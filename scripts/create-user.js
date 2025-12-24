
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

(async () => {
    const email = "bizgguya@gmail.com";
    // Check if exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("User already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    await prisma.user.create({
        data: {
            email,
            name: "Han JH",
            password: hashedPassword,
            phone: "010-1234-5678"
        }
    });
    console.log("User created");
})()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
