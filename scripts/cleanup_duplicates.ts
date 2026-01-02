
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Cleaning up duplicates ---");

    // Remove the duplicates that are incorrectly set as USER.
    // Based on verification, the correct ones (LAWYER/PROFESSIONAL) are preserved.
    // The pattern seems to be that we want to keep the one that IS LAWYER or PROFESSIONAL.

    // Deleting entries where role is USER but name matches our experts, assuming they are duplicates.
    // CAUTION: This assumes the USER entries are indeed the duplicates we want to remove.
    const experts = ["김율", "이서준", "박선영", "최은아"];

    for (const name of experts) {
        console.log(`Processing ${name}...`);

        // Find all profiles for this name
        const profiles = await (prisma as any).profile.findMany({
            where: { name: { contains: name } }
        });

        console.log(`Found ${profiles.length} profiles for ${name}`);

        if (profiles.length > 1) {
            // Keep the one with the 'best' role
            const bestRole = profiles.find((p: any) => p.role === 'LAWYER' || p.role === 'PROFESSIONAL');

            if (bestRole) {
                console.log(`Keeping ${bestRole.email} (${bestRole.role})`);

                const toDelete = profiles.filter((p: any) => p.id !== bestRole.id);
                for (const p of toDelete) {
                    console.log(`Deleting duplicate ${p.email} (${p.role})`);
                    await (prisma as any).profile.delete({ where: { id: p.id } });
                }
            } else {
                console.warn(`No optimal role found for ${name}, creating manual fix required?`);
                // If only USER roles exist, Upgrade one of them?
                // We shouldn't reach here if previous scripts worked.
            }
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
