import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log("----------------------------------------");
    console.log("🔍 Starting Admin User Verification");
    console.log("----------------------------------------");

    const email = 'admin@law-firm.com';
    const password = 'admin1234';

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error("❌ User NOT FOUND: " + email);
        console.log("Creating user now...");
    } else {
        console.log("✅ User FOUND: " + email);
        console.log("   ID: " + user.id);
        console.log("   Role: " + user.role);
        console.log("   Password Hash Length: " + (user.password?.length || 0));

        // 2. Verify Password
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                console.log("✅ Password Verification: SUCCESS");
            } else {
                console.error("❌ Password Verification: FAILED (Hash mismatch)");
            }
        } else {
            console.error("❌ Password Verification: FAILED (No password set)");
        }
    }

    // 3. Force Reset/Create
    console.log("----------------------------------------");
    console.log("🛠  Forcing Account Reset...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Using simple upsert
    const updated = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'SUPER_ADMIN',
            name: 'Super Admin',
            provider: 'local'
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            role: 'SUPER_ADMIN',
            provider: 'local'
        }
    });

    console.log("✅ Account Upserted.");
    console.log("   New Hash: " + updated.password?.substring(0, 10) + "...");

    // Double check
    const isMatchNow = await bcrypt.compare(password, updated.password!);
    console.log("✅ Final Verification: " + (isMatchNow ? "SUCCESS" : "FAILED"));
    console.log("----------------------------------------");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
