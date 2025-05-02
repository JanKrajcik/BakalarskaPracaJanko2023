const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'app');
const indexSourcePath = path.join(srcDir, 'view/index.html');
const docsDir = path.join(__dirname, 'docs');
const indexOutputPath = path.join(docsDir, 'index.html');



// Step 1: Copy all files from app/ to /docs with flattened structure
function copyDirectoryFlattened(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

    function processDirectory(currentPath) {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });

        for (const entry of entries) {
            const srcPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {
                processDirectory(srcPath);
            } else {
                const destPath = path.join(dest, entry.name);
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }

    processDirectory(src);
}

copyDirectoryFlattened(srcDir, docsDir);
console.log('All contents of /app copied to /docs with flattened structure');

// Step 2: Copy ace/ with flattened structure if it exists
const aceSrc = path.join(__dirname, 'ace');
if (fs.existsSync(aceSrc)) {
    copyDirectoryFlattened(aceSrc, docsDir);
    console.log('ace/ directory contents copied to /docs with flattened structure');
}

// Step 3: Read and rewrite index.html
if (!fs.existsSync(indexSourcePath)) {
    console.error(`ERROR: Source file not found at ${indexSourcePath}`);
    process.exit(1);
}

let content = fs.readFileSync(indexSourcePath, 'utf8');

content = content.replace(/(src|href)=["']([^"']+)["']/g, (match, attr, originalPath) => {
    if (/^(https?:)?\/\//.test(originalPath)) return match;
    const fileName = path.basename(originalPath);
    return `${attr}="./${fileName}"`;
});

// Step 4: Write rewritten index.html
fs.writeFileSync(indexOutputPath, content, 'utf8');
console.log('index.html rewritten to /docs');

console.log('Deployment completed successfully.');

