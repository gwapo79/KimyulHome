
import fs from 'fs';
import path from 'path';

const QUEUE_FILE = path.join(process.cwd(), 'generation_queue.json');

function main() {
    if (!fs.existsSync(QUEUE_FILE)) {
        console.error("Queue file missing.");
        return;
    }

    const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf-8'));

    // Filter pending
    // Also exclude the one we just did if it wasn't marked completed in the file yet.
    // The one we did was f2743ee9-93f1-4d64-8d84-9c13672c6496.

    const completedIds = ['f2743ee9-93f1-4d64-8d84-9c13672c6496'];

    const pending = queue.filter((item: any) =>
        item.status === 'PENDING' && !completedIds.includes(item.id)
    );

    const batch = pending.slice(0, 10);

    fs.writeFileSync('next_batch.json', JSON.stringify(batch, null, 2));
    console.log("Wrote batch to next_batch.json");
}

main();
