
import fs from 'fs';
import path from 'path';

function findLargeFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findLargeFiles(filePath));
        } else {
            results.push({ path: filePath, size: stat.size });
        }
    });
    return results;
}

const publicDir = path.join(process.cwd(), 'public');
const files = findLargeFiles(publicDir);
files.sort((a, b) => b.size - a.size);

console.log('Top 10 largest files:');
files.slice(0, 10).forEach(f => {
    console.log(`${(f.size / 1024 / 1024).toFixed(2)} MB - ${f.path}`);
});
