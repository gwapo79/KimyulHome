
import fs from 'fs';
import path from 'path';

const QUEUE_FILE = path.join(process.cwd(), 'blog_image_queue.json');

function main() {
    if (!fs.existsSync(QUEUE_FILE)) {
        console.error("Queue file not found.");
        return;
    }

    const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));

    // Reset ALL to PENDING
    const resetQueue = queue.map(item => ({
        ...item,
        status: 'PENDING',
        imagePath: null, // Clear prev path to force update
        generatedAt: null
    }));

    fs.writeFileSync(QUEUE_FILE, JSON.stringify(resetQueue, null, 2));
    console.log(`Reset ${resetQueue.length} items to PENDING.`);
}

main();
