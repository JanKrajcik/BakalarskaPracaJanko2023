// This script prepares index.html for deployment by replacing paths to local files with relative paths.

const fs = require('fs');
const path = require('path');

const srcFilePath = path.join(__dirname, './app/view/index.html');
const distDir = path.join(__dirname, 'dist');
const distFilePath = path.join(distDir, 'index.html');

// Clean & recreate dist directory
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir);

// Read index.html
let content = fs.readFileSync(srcFilePath, 'utf8');

// Replace paths
content = content.replace(/(src|href)=["']([^"']+)["']/g, (match, attr, originalPath) => {
    // Leave external links unchanged
    if (originalPath.startsWith('http') || originalPath.startsWith('//')) return match;
    const fileName = path.basename(originalPath);
    return `${attr}="./${fileName}"`;
});

// Write modified index.html
fs.writeFileSync(distFilePath, content, 'utf8');

console.log('Modified index.html written to /dist.');