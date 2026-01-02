
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Fixing Professional Roles ---");

    const professionals = ["sunyoung@sjlaw.co.kr", "eunah.choi@lawfirm.com"]; // Fixed email for eunah based on previous step findings? No wait, used 'euna@sjlaw.co.kr' in script but browser showed 'eunah.choi@lawfirm.com' for USER role duplicate. 
    // Wait, the browser found duplications. "Choi Eun-ah" (USER) might be a different record than "euna@sjlaw.co.kr".
    // I need to update ALL profiles with these names to PROFESSIONAL to be safe, or check by name.

    // Strategy: Update by name for these specific people to ensure visual correctness.

    await updateByName("박선영", "PROFESSIONAL");
    await updateByName("최은아", "PROFESSIONAL");
}

async function updateByName(name: string, role: string) {
    // Cast to any to bypass potential enum mismatch
    const res = await (prisma as any).profile.updateMany({
        where: { name: { contains: name } },
        data: { role: role }
    });
    console.log(`Updated ${name} to ${role}: ${res.count} records`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
