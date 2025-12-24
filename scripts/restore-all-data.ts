
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

console.log('--- STARTING FULL DATA RESTORATION ---');

// 1. Restore Blog
run('npx ts-node prisma/seed-blog.ts');

// 2. Restore FAQ
run('npx ts-node prisma/seed-faq.ts');

// 3. Restore Success Cases (From scripts/)
run('npx ts-node scripts/seed-success-case.ts');

// 4. Restore Billing (Universal Fix)
run('npx ts-node scripts/fix-prod-data.ts');

console.log('\n--- ALL DATA RESTORED SUCCESSFULLY ---');
