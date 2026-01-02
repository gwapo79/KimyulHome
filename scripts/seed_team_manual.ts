
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Seeding Team Data Instantly ---");

    // 1. Ensure CEO Profile
    const ceoEmail = "sjlaw14@naver.com"; // From SiteConfig
    console.log(`Setting up CEO: ${ceoEmail}`);

    await prisma.profile.upsert({
        where: { email: ceoEmail },
        update: {
            name: "김지율",
            role: Role.CEO,
            position: "대표 변호사",
            specialty: "부동산/금융/기업법무",
            phone: "010-1234-5678",
            avatarUrl: "/assets/images/team/ceo.jpg" // Placeholder if needed
        },
        create: {
            email: ceoEmail,
            name: "김지율",
            role: Role.CEO,
            phone: "010-1234-5678",
            avatarUrl: "/assets/images/team/ceo.jpg"
        }
    });
    console.log("✅ CEO Profile ensured.");

    // 2. Migrate Legacy TeamMembers (Again to be safe)
    const members = await prisma.teamMember.findMany();
    for (const m of members) {
        if (!m.email && !m.name) continue;

        // Generate email if missing
        const email = m.email || `legacy_${m.id.substring(0, 8)}@temp.com`;

        let role = Role.USER;
        if (m.role === 'LAWYER' || m.role === 'PROFESSIONAL') role = Role.PROFESSIONAL;
        else if (m.role === 'CEO' || m.role === 'SUPER_ADMIN') role = Role.CEO;
        else if (m.role === 'STAFF') role = Role.STAFF;

        await prisma.profile.upsert({
            where: { email },
            update: {
                name: m.name,
                role: role,
                avatarUrl: m.imageUrl,
                specialty: m.specialty,
                description: m.description,
                position: m.position
            },
            create: {
                email,
                name: m.name,
                role: role,
                avatarUrl: m.imageUrl,
                specialty: m.specialty,
                description: m.description,
                position: m.position
            }
        });
        console.log(`Synced Member: ${m.name}`);
    }

    // 3. Create Test Staff
    const testStaff = [
        { email: "staff1@kimyul.com", name: "김스텝", role: Role.STAFF, position: "송무팀 주임" },
        { email: "staff2@kimyul.com", name: "이행정", role: Role.STAFF, position: "행정팀 대리" }
    ];

    for (const s of testStaff) {
        await prisma.profile.upsert({
            where: { email: s.email },
            update: {
                name: s.name,
                role: s.role,
                position: s.position
            },
            create: {
                email: s.email,
                name: s.name,
                role: s.role,
                position: s.position
            }
        });
        console.log(`Created Staff: ${s.name}`);
    }

    console.log("--- Seeding Completed ---");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
