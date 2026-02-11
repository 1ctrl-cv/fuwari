import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { glob } from 'glob';

const CONTENT_DIR = 'src/content/posts';
const OUTPUT_FILE = 'src/json/git-history.json';

// Ensure the directory exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function getGitHistory(filePath) {
    try {
        const output = execSync(
            `git log --follow --pretty=format:"%H|%ad|%s|%an" --date=iso -- "${filePath}"`,
            { encoding: 'utf-8' }
        );

        if (!output) return [];

        return output
            .split('\n')
            .filter(line => line.trim() !== '')
            .map(line => {
                const [hash, date, message, author] = line.split('|');
                return { hash, date, message, author };
            });
    } catch (e) {
        console.warn(`Failed to retrieve git history for ${filePath}: ${e.message}`);
        return [];
    }
}

console.log('Generating git history...');

// Use glob to find all markdown files in the content directory
const files = glob.sync(`${CONTENT_DIR}/**/*.{md,mdx}`);
const historyMap = {};

let processedCount = 0;

files.forEach(file => {
    // Normalize path to use forward slashes for consistency
    const relativePath = path.relative(CONTENT_DIR, file).replace(/\\/g, '/');
    
    // Get history
    const history = getGitHistory(file);
    
    // Key by filename/id (matching how content collections work)
    historyMap[relativePath] = history;
    
    processedCount++;
    if (processedCount % 10 === 0) {
        console.log(`Processed ${processedCount}/${files.length} files...`);
    }
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(historyMap, null, 2));

console.log(`Git history generated for ${processedCount} files.`);
console.log(`Output saved to ${OUTPUT_FILE}`);
