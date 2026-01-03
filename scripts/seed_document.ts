
import { prisma } from '@/lib/prisma';

async function main() {
    console.log("📄 Seeding Test Document...");

    const email = 'client@test.com';
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error("❌ Test user not found. Run create_test_client.ts first.");
        return;
    }

    const doc = await prisma.document.create({
        data: {
            title: '사건 위임 계약서.pdf',
            fileName: '사건_위임_계약서_v1.pdf',
            url: 'https://example.com/dummy.pdf',
            fileSize: '1.2MB',
            category: 'CONTRACT',
            uploader: 'LAWYER',
            userId: user.id,
            fileType: 'application/pdf'
        }
    });

    console.log(`✅ Document created: ${doc.title} (ID: ${doc.id}) for ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
