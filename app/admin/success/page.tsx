
import { prisma } from '@/lib/prisma';
import SuccessListClient from './SuccessListClient';

export const dynamic = 'force-dynamic';

export default async function SuccessPage() {
    const cases = await prisma.successCase.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return <SuccessListClient initialCases={cases} />;
}
