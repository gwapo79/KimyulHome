import { getReviews } from '@/app/actions/review';
import ReviewListClient from './ReviewListClient';

export const dynamic = 'force-dynamic';

export default async function ReviewsPage() {
    const { data: reviews } = await getReviews();

    return (
        <ReviewListClient initialReviews={reviews || []} />
    );
}
