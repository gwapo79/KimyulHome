
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Restoring Real 4 Experts & Mapping Content (Aggressive Fix) ---");

    // Using 'as any' for Role to avoid enum mismatch 'PROFESSIONAL' vs 'USER' etc if schema outdated in client
    const experts = [
        {
            name: "김율",
            email: "kimyul@sjlaw.co.kr",
            role: "LAWYER",
            position: "대표 변호사",
            specialty: "부동산/민사",
            avatarUrl: "/assets/images/team/kimyul.jpg"
        },
        {
            name: "이서준",
            email: "seojun@sjlaw.co.kr",
            role: "LAWYER",
            position: "파트너 변호사",
            specialty: "형사/가사",
            avatarUrl: "/assets/images/team/seojun.jpg"
        },
        {
            name: "박선영",
            email: "sunyoung@sjlaw.co.kr",
            role: "PROFESSIONAL",  // 'Expert' role
            position: "대표 법무사",
            specialty: "등기/공탁",
            avatarUrl: "/assets/images/team/sunyoung.jpg"
        },
        {
            name: "최은아",
            email: "euna@sjlaw.co.kr",
            role: "PROFESSIONAL",
            position: "수석 법무사",
            specialty: "회생/파산",
            avatarUrl: "/assets/images/team/euna.jpg"
        }
    ];

    const expertIds: string[] = [];

    // 1. Upsert Profiles
    for (const expert of experts) {
        try {
            const profile = await (prisma as any).profile.upsert({
                where: { email: expert.email },
                update: {
                    name: expert.name,
                    role: expert.role,
                    position: expert.position,
                    specialty: expert.specialty,
                    avatarUrl: expert.avatarUrl
                },
                create: {
                    email: expert.email,
                    name: expert.name,
                    role: expert.role,
                    position: expert.position,
                    specialty: expert.specialty,
                    avatarUrl: expert.avatarUrl
                }
            });
            expertIds.push(profile.id);
            console.log(`✅ Restored Expert: ${expert.name} (${profile.id})`);
        } catch (e) {
            console.error(`Failed to restore ${expert.name}:`, e);
        }
    }

    if (expertIds.length === 0) {
        console.error("No experts restored. Aborting mapping.");
        return;
    }

    // 2. Force Map Content (Round Robin)
    console.log(`--- Mapping Content to ${expertIds.length} Experts ---`);

    // Blog Posts
    const blogs = await prisma.blogPost.findMany();
    console.log(`Found ${blogs.length} blogs. Mapping...`);

    for (let i = 0; i < blogs.length; i++) {
        const expertId = expertIds[i % expertIds.length]; // Round robin
        await (prisma.blogPost as any).update({
            where: { id: blogs[i].id },
            data: { assignedProfileId: expertId }
        });
    }
    console.log("✅ Blogs mapped.");

    // Success Cases
    const cases = await prisma.successCase.findMany();
    console.log(`Found ${cases.length} cases. Mapping...`);

    for (let i = 0; i < cases.length; i++) {
        const expertId = expertIds[i % expertIds.length];
        await (prisma.successCase as any).update({
            where: { id: cases[i].id },
            data: { assignedProfessionalId: expertId }
        });
    }
    console.log("✅ Cases mapped.");

    console.log("--- Restoration Complete ---");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
