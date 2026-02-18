#!/usr/bin/env node
/**
 * Run after npm run build. Prints a short checklist for uploading to Hostinger.
 * Full steps: see DEPLOYMENT.md
 */
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'public', 'build');
const hasBuild = fs.existsSync(buildDir) && fs.existsSync(path.join(buildDir, 'manifest.json'));

console.log('\n--- Hostinger upload checklist ---\n');
if (hasBuild) {
  console.log('  ✓ public/build/ is ready (include it when you upload).');
} else {
  console.log('  ✗ Run: npm run build   (then run this again).');
}
console.log('  • Upload the whole project except: node_modules, .git, .env');
console.log('  • On server: create .env from .env.example with production values');
console.log('  • Point document root to the public/ folder (or see DEPLOYMENT.md for public_html setup)');
console.log('  • Set storage/ and bootstrap/cache/ writable (e.g. 775)\n');
console.log('Full guide: DEPLOYMENT.md\n');
