
import fs from 'fs';
import path from 'path';

const QUEUE_FILE = path.join(process.cwd(), 'blog_image_queue.json');

if (!fs.existsSync(QUEUE_FILE)) {
    console.log("No blog queue file found.");
    process.exit(0);
}

const data = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));
const completed = data.filter((i: any) => i.status === 'COMPLETED');
const pending = data.filter((i: any) => i.status === 'PENDING');

console.log(`--- Blog Queue Analysis ---`);
console.log(`Total Items: ${data.length}`);
console.log(`Completed: ${completed.length}`);
console.log(`Pending: ${pending.length}`);

if (completed.length > 0) {
    const lastCompleted = completed[completed.length - 1];
    console.log(`\nLast Completed (Index ${data.indexOf(lastCompleted)}):`);
    console.log(`Title: ${lastCompleted.title}`);
    console.log(`ID: ${lastCompleted.id}`);
}

if (pending.length > 0) {
    const nextItem = pending[0];
    const index = data.indexOf(nextItem);
    console.log(`\nNext Pending (Index ${index}):`);
    console.log(`Title: ${nextItem.title}`);
    console.log(`ID: ${nextItem.id}`);
}
