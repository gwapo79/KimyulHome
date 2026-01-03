
import fs from 'fs';
import path from 'path';

const QUEUE_FILE = path.join(process.cwd(), 'generation_queue.json');

if (!fs.existsSync(QUEUE_FILE)) {
    console.log("No queue file found.");
    process.exit(0);
}

const data = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
const total = data.length;
const completed = data.filter((i: any) => i.status === 'COMPLETED').length;
const pending = data.filter((i: any) => i.status === 'PENDING');

console.log(`--- Queue Analysis ---`);
console.log(`Total Items: ${total}`);
console.log(`Completed: ${completed}`);
console.log(`Pending: ${pending.length}`);

if (pending.length > 0) {
    const nextItem = pending[0];
    const index = data.indexOf(nextItem); // 0-based index
    console.log(`\nStopped at Index: ${index} (Item #${index + 1})`);
    console.log(`Next Goal: [${nextItem.type}] ${nextItem.id}`);
    console.log(`Prompt Preview: ${nextItem.targetPrompt.substring(0, 100)}...`);
} else {
    console.log("\nAll items completed!");
}
