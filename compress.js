const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 압축할 폴더 목록 (여기가 비만 구역임)
const targetDirs = ['./public/assets/images', './public/images'];

async function compressImages(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await compressImages(filePath); // 하위 폴더도 뒤져라
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                // 500KB 넘는 것만 조진다
                if (stat.size > 500 * 1024) {
                    console.log(`압축 중...: ${filePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);

                    try {
                        const buffer = fs.readFileSync(filePath);

                        // 폭 1920px 제한, 퀄리티 80% (눈으로 보면 차이 없음)
                        await sharp(buffer)
                            .resize(1920, null, { withoutEnlargement: true })
                            .jpeg({ quality: 80, mozjpeg: true })
                            .png({ quality: 80, compressionLevel: 8 })
                            .toFile(filePath + '.temp');

                        fs.unlinkSync(filePath); // 원본 삭제
                        fs.renameSync(filePath + '.temp', filePath); // 압축본으로 교체
                    } catch (e) {
                        console.error(`Failed to compress ${filePath}:`, e.message);
                        // Clean up temp file if exists
                        if (fs.existsSync(filePath + '.temp')) {
                            fs.unlinkSync(filePath + '.temp');
                        }
                    }
                }
            }
        }
    }
}

// 실행
(async () => {
    console.log("🚀 이미지 다이어트 시작...");
    for (const dir of targetDirs) {
        if (fs.existsSync(dir)) await compressImages(dir);
    }
    console.log("✅ 압축 완료! 이제 배포해라.");
})();
