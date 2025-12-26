
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const successCount = await prisma.successCase.count();
  const reviewCount = await prisma.review.count();
  const faqCount = await prisma.fAQ.count();
  console.log({ successCount, reviewCount, faqCount });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
