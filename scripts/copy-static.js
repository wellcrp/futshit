const fs = require('fs');
const path = require('path');

const sourcePublic = path.resolve(__dirname, '..', 'src', 'public');
const targetPublic = path.resolve(__dirname, '..', 'dist', 'public');
const sourceData = path.resolve(__dirname, '..', 'src', 'data');
const targetData = path.resolve(__dirname, '..', 'dist', 'data');

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

copyDirectory(sourcePublic, targetPublic);
copyDirectory(sourceData, targetData);
console.log(`Copied static files from ${sourcePublic} to ${targetPublic}`);
console.log(`Copied data files from ${sourceData} to ${targetData}`);
