
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Seeding Team Data Instantly (Retry) ---");

    try {
        // 1. Ensure CEO Profile
        const ceoEmail = "sjlaw14@naver.com";
        console.log(`Setting up CEO: ${ceoEmail}`);

        // Use explicit any cast or ts-ignore to avoid 'Profile' type mismatch if client is stale
        const ceoData = {
            name: "김지율",
            role: "CEO" as any, // Cast to any to avoid Enum mismatch issues if client is outdated
            position: "대표 변호사",
            specialty: "부동산/금융/기업법무",
            phone: "010-1234-5678",
            avatarUrl: "/assets/images/team/ceo.jpg"
        };

        await prisma.profile.upsert({
            where: { email: ceoEmail },
            update: ceoData,
            create: {
                email: ceoEmail,
                ...ceoData
            }
        });
        console.log("✅ CEO Profile ensured.");

        // 2. Migrate Legacy TeamMembers
        const members = await prisma.teamMember.findMany();
        console.log(`Found ${members.length} team members.`);

        for (const m of members) {
            if (!m.name) continue;
            const email = m.email || `legacy_${m.id.substring(0, 8)}@temp.com`;

            // Map Role
            let role = 'USER';
            if (m.role === 'LAWYER' || m.role === 'PROFESSIONAL') role = 'PROFESSIONAL';
            else if (m.role === 'CEO' || m.role === 'SUPER_ADMIN') role = 'CEO';
            else if (m.role === 'STAFF') role = 'STAFF';

            const updateData = {
                name: m.name,
                role: role as any,
                avatarUrl: m.imageUrl,
                specialty: m.specialty,
                description: m.description,
                position: m.position
            };

            await prisma.profile.upsert({
                where: { email },
                update: updateData,
                create: {
                    email,
                    ...updateData
                }
            });
            console.log(`Synced Member: ${m.name}`);
        }

        // 3. Create Test Staff
        const testStaff = [
            { email: "staff1@kimyul.com", name: "김스텝", role: "STAFF", position: "송무팀 주임" },
            { email: "staff2@kimyul.com", name: "이행정", role: "STAFF", position: "행정팀 대리" }
        ];

        for (const s of testStaff) {
            await prisma.profile.upsert({
                where: { email: s.email },
                update: {
                    name: s.name,
                    role: s.role as any,
                    position: s.position
                },
                create: {
                    email: s.email,
                    name: s.name,
                    role: s.role as any,
                    position: s.position
                }
            });
            console.log(`Created Staff: ${s.name}`);
        }

        // 4. VERIFY DATA
        const count = await prisma.profile.count();
        console.log(`\n\n[FINAL CHECK] Total Profiles in DB: ${count}`);
        const profiles = await prisma.profile.findMany();
        console.log("Current Profiles:", profiles.map(p => `${p.name} (${p.role})`).join(", "));

    } catch (e) {
        console.error("SEEDING FAILED:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
