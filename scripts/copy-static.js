const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '..', 'src', 'public');
const targetDir = path.resolve(__dirname, '..', 'dist', 'public');

function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory not found: ${src}`);
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDirectory(sourceDir, targetDir);
console.log(`Copied static files from ${sourceDir} to ${targetDir}`);
