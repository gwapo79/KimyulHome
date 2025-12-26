
import fs from 'fs';
import path from 'path';

const QUEUE_FILE = path.join(process.cwd(), 'blog_image_queue.json');

// IDs that were successfully done in "Context Realism" style
const COMPLETED_IDS = [
    '847b734e-bc28-4c87-aa9a-b3a8a78aa6e0', // Insurance (Hospital)
    '4833fae3-a1a4-4a4d-b374-dac03fb7395d', // Rehab (Doctor Desk)
    'a8b55f5b-9de2-468d-abfe-76e2babf1ede', // Dismissal (Box)
    'dde1327d-bff0-4964-b097-09c95d0ef7d6'  // Crypto (Phone)
];

function main() {
    const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));

    const updatedQueue = queue.map(item => {
        if (COMPLETED_IDS.includes(item.id)) {
            return {
                ...item,
                status: 'COMPLETED',
                imagePath: `/assets/images/unique/blog_${item.id.split('-')[0]}.png`,
                generatedAt: new Date().toISOString()
            };
        } else {
            return {
                ...item,
                status: 'PENDING',
                // Clear image path for pending items to ensure re-generation
                imagePath: null,
                generatedAt: null
            };
        }
    });

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(updatedQueue, null, 2));
    console.log(`Restored status: ${COMPLETED_IDS.length} Completed, ${updatedQueue.length - COMPLETED_IDS.length} Pending.`);
}

main();
