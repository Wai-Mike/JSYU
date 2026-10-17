#!/usr/bin/env bash
# Run on the server after every upload, from the project folder (cPanel → Terminal):
#   cd ~/jsyu && bash scripts/cpanel-deploy.sh
# Safe to run repeatedly. See DEPLOYMENT.md.
set -euo pipefail

cd "$(dirname "$0")/.."
PHP="${PHP:-php}"

step() { printf '\n\033[1;32m==> %s\033[0m\n' "$1"; }

if [ ! -f .env ]; then
    echo "No .env yet. Copy .env.production.example to .env, fill it in, then run this again."
    exit 1
fi

if grep -n 'CHANGE_ME' .env; then
    echo "Replace the CHANGE_ME values above in .env, then run this again."
    exit 1
fi

# A leftover dev-server marker makes every page load scripts from localhost (blank pages)
rm -f public/hot

if [ ! -f public/build/manifest.json ]; then
    echo "public/build is missing. Build locally (npm run package:cpanel) and upload it."
    exit 1
fi

step "PHP dependencies"
if [ -f vendor/autoload.php ] && [ "${1:-}" != "--composer" ]; then
    echo "vendor/ present (pass --composer to reinstall)."
else
    COMPOSER="$(command -v composer || echo "$PHP composer.phar")"
    $COMPOSER install --no-dev --optimize-autoloader --no-interaction
fi

step "Application key"
if ! grep -qE '^APP_KEY=.+' .env; then
    "$PHP" artisan key:generate --force
else
    echo "Already set."
fi

step "Writable folders"
mkdir -p storage/framework/{cache/data,sessions,views} storage/logs storage/app/public bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

step "Database"
"$PHP" artisan migrate --force
# Reference data only. Never run the full db:seed here: UserSeeder creates admins with a known password.
"$PHP" artisan db:seed --class=JongleiGeographySeeder --force
"$PHP" artisan portal:sync-access

step "Public storage link"
if [ -e public/storage ]; then
    echo "Already linked."
else
    "$PHP" artisan storage:link || ln -s ../storage/app/public public/storage
fi

step "Caches"
"$PHP" artisan optimize:clear
"$PHP" artisan optimize

step "Done"
echo "Open https://jsyu.org and https://portal.jsyu.org to check."
