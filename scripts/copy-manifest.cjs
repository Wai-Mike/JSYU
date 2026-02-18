const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', 'public', 'build', '.vite', 'manifest.json');
const dest = path.join(__dirname, '..', 'public', 'build', 'manifest.json');
if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Manifest copied to public/build/manifest.json');
}
