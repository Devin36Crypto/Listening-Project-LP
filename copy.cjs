const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const dirsToCopy = ['src', 'public'];
const filesToCopy = ['index.html', 'package.json', 'vite.config.ts', 'README.md', 'metadata.json', 'vercel.json'];

dirsToCopy.forEach(dir => {
  if (fs.existsSync(path.join('temp_dir', dir))) {
    copyRecursiveSync(path.join('temp_dir', dir), path.join('.', dir));
  }
});

filesToCopy.forEach(file => {
  if (fs.existsSync(path.join('temp_dir', file))) {
    fs.copyFileSync(path.join('temp_dir', file), path.join('.', file));
  }
});

console.log('Copy complete.');
