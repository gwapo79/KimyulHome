
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Fixing Expert Roles ---");

    const lawyers = ["kimyul@sjlaw.co.kr", "seojun@sjlaw.co.kr"];
    const professionals = ["sunyoung@sjlaw.co.kr", "euna@sjlaw.co.kr"];

    for (const email of lawyers) {
        // Cast to any to bypass potential enum mismatch if client is stale
        await (prisma as any).profile.update({
            where: { email },
            data: { role: "LAWYER" }
        });
        console.log(`Updated ${email} to LAWYER`);
    }

    for (const email of professionals) {
        // Cast to any to bypass potential enum mismatch if client is stale
        await (prisma as any).profile.update({
            where: { email },
            data: { role: "PROFESSIONAL" }
        });
        console.log(`Updated ${email} to PROFESSIONAL`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
