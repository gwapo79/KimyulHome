
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const SUCCESS_IMG_DIR_REL = '/assets/images/success_cases';
const REVIEW_IMG_DIR_REL = '/assets/images/reviews';
const SUCCESS_IMG_DIR_ABS = path.join(process.cwd(), 'public', SUCCESS_IMG_DIR_REL);
const REVIEW_IMG_DIR_ABS = path.join(process.cwd(), 'public', REVIEW_IMG_DIR_REL);

function getFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(file => !file.startsWith('.') && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.webp')));
}

function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Helper to find best matching image for a category
function getBestImageForCategory(category: string, availableImages: string[]): string {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const catSimple = normalize(category);

    // Keywords mapping
    const keywords: Record<string, string[]> = {
        '부동산': ['realestate', 'apartment', 'home', 'construction'],
        '민사': ['civil', 'office', 'document', 'court'],
        '형사': ['criminal', 'police', 'law'],
        '가사': ['family', 'divorce', 'home'],
        '이혼': ['family', 'divorce'],
        '기업': ['corporate', 'business', 'meeting'],
        '행정': ['civil', 'document']
    };

    // Find keywords for this category
    let targetKeywords: string[] = [];
    for (const [key, words] of Object.entries(keywords)) {
        if (category.includes(key)) {
            targetKeywords = words;
            break;
        }
    }
    if (targetKeywords.length === 0) targetKeywords = ['civil', 'general']; // Default

    // Try to find an image containing one of the keywords
    const matches = availableImages.filter(img => targetKeywords.some(kw => img.toLowerCase().includes(kw)));

    if (matches.length > 0) {
        // Return a random match
        return matches[Math.floor(Math.random() * matches.length)];
    }

    // Fallback: random image
    return availableImages[Math.floor(Math.random() * availableImages.length)];
}

async function main() {
    console.log("--- Starting Image Mapping ---");

    // 1. Map Success Cases
    const successFiles = getFiles(SUCCESS_IMG_DIR_ABS);
    console.log(`Found ${successFiles.length} success case images.`);

    if (successFiles.length > 0) {
        const cases = await prisma.successCase.findMany();
        console.log(`Updating ${cases.length} success cases...`);

        // We want uniqueness if possible. 
        // If we have 60 cases and 20 images, we must reuse. 
        // Strategy: Use an available pool. When pool is empty, refill it (reuse).

        let pool = [...successFiles];
        shuffleArray(pool);

        for (const c of cases) {
            let selectedImage = '';

            // Try to find a category match in the pool first
            // This is complex because "popping" a specific match is hard.
            // Simplified approach: Just assign from pool to ensure uniqueness first.
            // visual relevance < uniqueness in this request context? 
            // Request: "60건의 성공사례는 모두 서로 다른 이미지를 가져야 한다." -> This implies uniqueness is paramount.
            // Request: "각 성공사례의 제목과 내용에 어울리는 상징적인 이미지" -> Relevance is also important.

            // Compromise: Filter pool for relevance. If match found, use and remove. 
            // If no match found, use and remove random from pool.
            // If pool empty, reset pool (violation of strict uniqueness, but unavoidable if file count < case count).

            if (pool.length === 0) {
                pool = [...successFiles];
                shuffleArray(pool);
            }

            // Keyword based filtering from pool
            const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cat = c.category || '';

            const keywords: Record<string, string[]> = {
                '부동산': ['realestate', 'apt', 'construction'],
                '민사': ['civil', 'office', 'court'],
                '형사': ['criminal', 'police'],
                '가사': ['family', 'home'],
                '기업': ['corporate', 'business', 'meeting']
            };

            let targetKeywords: string[] = ['civil']; // default
            for (const [key, words] of Object.entries(keywords)) {
                if (cat.includes(key)) {
                    targetKeywords = words;
                    break;
                }
            }

            const matchIndex = pool.findIndex(img => targetKeywords.some(kw => img.toLowerCase().includes(kw)));

            if (matchIndex !== -1) {
                selectedImage = pool[matchIndex];
                pool.splice(matchIndex, 1);
            } else {
                // No relevant match, take first one
                selectedImage = pool[0];
                pool.shift();
            }

            const imageUrl = `${SUCCESS_IMG_DIR_REL}/${selectedImage}`;
            await prisma.successCase.update({
                where: { id: c.id },
                data: { imageUrl: imageUrl }
            });
        }
        console.log("Success Cases updated.");
    } else {
        console.log("No success case images found (skipping).");
    }

    // 2. Map Reviews
    const reviewFiles = getFiles(REVIEW_IMG_DIR_ABS);
    console.log(`Found ${reviewFiles.length} review images.`);

    if (reviewFiles.length > 0) {
        const reviews = await prisma.review.findMany();
        console.log(`Updating ${reviews.length} reviews...`);

        // Strict uniqueness requested.
        let pool = [...reviewFiles];
        shuffleArray(pool);

        for (const r of reviews) {
            if (pool.length === 0) {
                pool = [...reviewFiles];
                shuffleArray(pool);
            }
            const img = pool.pop(); // Take one
            const authorImageUrl = `${REVIEW_IMG_DIR_REL}/${img}`;

            await prisma.review.update({
                where: { id: r.id },
                data: { authorImageUrl: authorImageUrl }
            });
        }
        console.log("Reviews updated.");
    } else {
        console.log("No review images found (skipping).");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
