
import { execSync } from 'child_process';

function run(cmd: string) {
    console.log(`\n>>> EXECUTING: ${cmd}`);
    try {
        execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
        console.log(`>>> SUCCESS: ${cmd}`);
    } catch (e) {
        console.error(`>>> FAILED: ${cmd}`);
        process.exit(1);
    }
}

// 1. Seed Success Cases
run('npx ts-node scripts/seed-success-case.ts');

// 2. Seed Reviews
run('npx ts-node prisma/seed-reviews.ts');
