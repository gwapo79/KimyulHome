
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("--- Starting Migration: TeamMember -> Profile ---");

    // 1. Fetch all legacy TeamMembers
    const teamMembers = await prisma.teamMember.findMany();
    console.log(`Found ${teamMembers.length} team members to migrate.`);

    for (const member of teamMembers) {
        if (!member.name) continue;

        console.log(`Processing: ${member.name} (${member.role})`);

        // Determine Role
        let role: Role = Role.USER;
        if (member.role === 'SUPER_ADMIN' || member.role === 'ADMIN') role = Role.CEO;
        else if (member.role === 'LAWYER') role = Role.LAWYER; // Mapped to LAWYER as per enum
        else if (member.role === 'STAFF') role = Role.STAFF;

        // Determine Email (Critical for Unique Constraint)
        let email = member.email;
        if (!email) {
            email = `legacy_${member.id.substring(0, 8)}@kimyul.com`;
            console.warn(`  - No email found. Generated fallback: ${email}`);
        }

        // Upsert Profile
        const profile = await prisma.profile.upsert({
            where: { email: email },
            update: {
                name: member.name,
                role: role,
                avatarUrl: member.imageUrl,
            },
            create: {
                email: email,
                name: member.name,
                role: role,
                avatarUrl: member.imageUrl,
            }
        });
        console.log(`  -> Profile Synced: ${profile.id}`);

        // Update BlogPosts
        // @ts-ignore
        const blogCount = await prisma.blogPost.updateMany({
            where: { authorId: member.id },
            data: { assignedProfileId: profile.id }
        });
        if (blogCount.count > 0) console.log(`  -> Linked ${blogCount.count} blog posts.`);

        // Update SuccessCases
        // @ts-ignore
        const caseCount = await prisma.successCase.updateMany({
            where: { lawyerId: member.id },
            data: { assignedProfessionalId: profile.id }
        });
        if (caseCount.count > 0) console.log(`  -> Linked ${caseCount.count} success cases.`);

        // Update ChatRooms
        // @ts-ignore
        const chatCount = await prisma.chatRoom.updateMany({
            where: { lawyerId: member.id },
            data: { assignedProfessionalId: profile.id }
        });
        if (chatCount.count > 0) console.log(`  -> Linked ${chatCount.count} chat rooms.`);
    }

    console.log("--- Migration Completed ---");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
