
import { prisma } from '../lib/prisma';

async function main() {
    const email = 'admin@petkage.com';

    console.log(`Checking role for ${email}...`);
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, role: true, name: true }
    });

    if (!user) {
        console.error(`User ${email} not found!`);
        return;
    }

    console.log(`Current Role: ${user.role}`);

    if (user.role !== 'SUPER_ADMIN') {
        console.log(`Updating role to SUPER_ADMIN...`);
        const updated = await prisma.user.update({
            where: { email },
            data: { role: 'SUPER_ADMIN' }
        });
        console.log(`New User Role: ${updated.role}`);
    } else {
        console.log('User Role is already SUPER_ADMIN.');
    }

    // Check Profile Table
    const profile = await prisma.profile.findUnique({
        where: { email },
        select: { id: true, role: true }
    });

    if (profile) {
        console.log(`Current Profile Role: ${profile.role}`);
        if (profile.role !== 'SUPER_ADMIN') {
            console.log(`Updating Profile role to SUPER_ADMIN...`);
            const updatedProfile = await prisma.profile.update({
                where: { email },
                data: { role: 'SUPER_ADMIN' }
            });
            console.log(`New Profile Role: ${updatedProfile.role}`);
        } else {
            console.log('Profile Role is already SUPER_ADMIN.');
        }
    } else {
        console.log('Profile not found for this email.');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
