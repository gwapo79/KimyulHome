
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'public', 'images', 'success_cases');

async function compressImages() {
    if (!fs.existsSync(targetDir)) {
        console.error(`Target directory not found: ${targetDir}`);
        return;
    }

    const files = fs.readdirSync(targetDir);
    let totalOriginalSize = 0;
    let totalNewSize = 0;

    console.log(`Found ${files.length} files. Starting compression...`);

    for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

        const filePath = path.join(targetDir, file);
        const stats = fs.statSync(filePath);
        totalOriginalSize += stats.size;

        const tempPath = filePath + '.temp';

        try {
            await sharp(filePath)
                .resize(1024, 1024, { // Reasonable max size
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 70, mozjpeg: true }) // Aggressive compression
                .toFile(tempPath);

            // Replace original
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);

            const newStats = fs.statSync(filePath);
            totalNewSize += newStats.size;

            console.log(`Processed ${file}: ${(stats.size / 1024).toFixed(1)}KB -> ${(newStats.size / 1024).toFixed(1)}KB`);
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
            // Cleanup temp if exists
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        }
    }

    console.log('--- Compression Complete ---');
    console.log(`Original Total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`New Total: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
}

compressImages();
