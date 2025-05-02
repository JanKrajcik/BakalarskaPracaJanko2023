const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'app');
const indexSourcePath = path.join(srcDir, 'view/index.html');
const docsDir = path.join(__dirname, 'docs');
const indexOutputPath = path.join(docsDir, 'index.html');

// Ensure /docs exists
if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
}

// Read index.html content
let content = fs.readFileSync(indexSourcePath, 'utf8');

// Automatically fix local src/href paths
content = content.replace(/(src|href)=["']([^"']+)["']/g, (match, attr, originalPath) => {
    // Keep external links (e.g. https://...)
    if (/^(https?:)?\/\//.test(originalPath)) return match;

    const fileName = path.basename(originalPath); // Extract just "file.js"
    return `${attr}="./${fileName}"`;
});

// Write output to debug and final destination
fs.writeFileSync(path.join(__dirname, 'debug_index_output.html'), content, 'utf8'); // optional
fs.writeFileSync(indexOutputPath, content, 'utf8');

console.log('✅ index.html paths automatically rewritten and saved to /docs');