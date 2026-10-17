#!/usr/bin/env node
/**
 * Builds dist/jsyu-cpanel.zip: everything the server needs, nothing it doesn't.
 *
 *   npm run package:cpanel                 build assets, install production vendor/, zip
 *   npm run package:cpanel -- --no-vendor  skip vendor/ (run composer on the server instead)
 *   npm run package:cpanel -- --no-build   reuse the current public/build
 *
 * Files come from git (tracked + new, minus .gitignore), so .env, node_modules,
 * public/hot and logs never ship. Your local vendor/ is left untouched: production
 * packages are installed into the staging copy. Upload steps: DEPLOYMENT.md.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const stage = path.join(dist, 'jsyu');
const zip = path.join(dist, 'jsyu-cpanel.zip');
const args = process.argv.slice(2);

// Runtime files only (no tests, docs, frontend sources or dev tooling)
const include = [
    'app/',
    'bootstrap/',
    'config/',
    'database/',
    'public/',
    'resources/views/',
    'routes/',
    'storage/',
    '.htaccess',
    '.env.production.example',
    'artisan',
    'composer.json',
    'composer.lock',
    'composer.phar',
    'DEPLOYMENT.md',
    'scripts/cpanel-deploy.sh',
];
const exclude = ['public/hot', 'public/storage'];

const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: 'inherit' });
const step = (msg) => console.log(`\n\x1b[1;32m==> ${msg}\x1b[0m`);

if (!args.includes('--no-build')) {
    step('Building frontend assets');
    run('npm run build');
}

if (!fs.existsSync(path.join(root, 'public/build/manifest.json'))) {
    console.error('public/build/manifest.json is missing. Run npm run build first.');
    process.exit(1);
}

step('Collecting files');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(stage, { recursive: true });

const files = execSync('git ls-files --cached --others --exclude-standard -z', { cwd: root })
    .toString()
    .split('\0')
    .filter(Boolean)
    .filter((f) => include.some((p) => (p.endsWith('/') ? f.startsWith(p) : f === p)))
    .filter((f) => !exclude.some((p) => f === p || f.startsWith(p + '/')))
    .filter((f) => fs.existsSync(path.join(root, f))); // skip files deleted but not yet committed

for (const f of files) {
    fs.mkdirSync(path.dirname(path.join(stage, f)), { recursive: true });
    fs.copyFileSync(path.join(root, f), path.join(stage, f));
}
console.log(`${files.length} files`);

if (!args.includes('--no-vendor')) {
    step('Installing production PHP packages (staging copy only)');
    let composer = 'composer';
    try {
        execSync('composer --version', { stdio: 'ignore' });
    } catch {
        composer = 'php composer.phar';
    }
    // --no-scripts: Laravel rebuilds its package cache on the server by itself
    run(`${composer} install --no-dev --optimize-autoloader --no-interaction --no-scripts`, stage);
}

step('Zipping');
if (process.platform === 'win32') {
    run(`"${process.env.SystemRoot}\\System32\\tar.exe" -a -c -f "${zip}" .`, stage);
} else {
    run(`zip -qr "${zip}" .`, stage);
}
fs.rmSync(stage, { recursive: true, force: true });

console.log(`\n${path.relative(root, zip)}  (${(fs.statSync(zip).size / 1048576).toFixed(1)} MB)`);
console.log('Next: upload and extract it on the server, then follow DEPLOYMENT.md.\n');
