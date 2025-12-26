
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

async function runBatch() {
    try {
        console.log(`[${new Date().toISOString()}] Starting batch generation...`);
        const { stdout, stderr } = await execPromise('npx tsx scripts/run_image_generation.ts --limit=2');
        console.log(stdout);
        if (stderr) console.error(stderr);
        console.log(`[${new Date().toISOString()}] Batch complete.`);
    } catch (error) {
        console.error(`Error running batch:`, error);
    }
}

async function loop() {
    // Immediate first run
    await runBatch();

    // Loop every 10 minutes (600000 ms)
    const INTERVAL = 10 * 60 * 1000;

    setInterval(async () => {
        await runBatch();
    }, INTERVAL);

    console.log(`Scheduler started. Running every 10 minutes.`);
}

loop();
