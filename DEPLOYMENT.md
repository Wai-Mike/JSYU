# Deploying JSYU to Hostinger

This guide covers deploying the Jonglei State Youth Union (Laravel + Inertia + React + Vite) app to Hostinger.

---

## Before you deploy

- **PHP**: Hostinger must support **PHP 8.2+** (Laravel 12 requirement).
- **Node.js**: You only need Node locally to **build** the frontend; the server does not need Node.
- Choose one:
  - **Shared hosting**: Upload files via File Manager/FTP. You must build assets on your PC and upload the built files.
  - **VPS**: Hostinger’s [Laravel VPS](https://www.hostinger.com/laravel-hosting) template (with CloudPanel) is the easiest; you get SSH and can run Composer and migrations on the server.

---

## Step 1: Prepare the project on your computer

Run these in your project folder **before** uploading.

### 1.1 Install dependencies and build frontend

```bash
npm ci
npm run build
```

This creates `public/build/` (JS/CSS). **You must upload this folder**; the app will not work without it.

### 1.2 (Optional) Install production PHP dependencies locally

If you will upload `vendor/` (e.g. no SSH on shared hosting):

```bash
composer install --no-dev --optimize-autoloader
```

If you have **SSH on the server** (VPS), you can skip this and run `composer install` on the server instead.

### 1.3 Create production `.env`

Copy `.env.example` to `.env.production` and set:

```env
APP_NAME="Jonglei State Youth Union"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Generate a key locally: php artisan key:generate --show
APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=

# Database (create MySQL DB in Hostinger panel first)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

# Session & cache (use file or database)
SESSION_DRIVER=file
CACHE_STORE=file

# Mail (set to Hostinger SMTP or your mail service)
MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=...
MAIL_USERNAME=...
MAIL_PASSWORD=...
```

Rename `.env.production` to `.env` **on the server** (or type the same values into `.env` there). **Never commit `.env` or `.env.production` with real secrets.**

---

## Step 2a: Hostinger shared hosting (File Manager / FTP)

### What to upload

Upload the **entire project** except:

- `node_modules/` (do not upload)
- `.git/` (optional to skip)
- `.env` (create on server from `.env.production` or type in)
- `vendor/` only if you ran `composer install` locally; otherwise you need a way to run Composer (e.g. Hostinger’s “SSH Access” if available)

**Must be included:**

- `public/build/` (from `npm run build`)
- All other app files (app/, config/, database/, resources/, routes/, etc.)
- `public/` (index.php, favicon, build folder, etc.)

### Where to put files

**Option A – Document root is your project root (if Hostinger allows)**

- Set document root to the folder that contains `public/`.
- Point the domain’s document root to: `.../your-project/public`  
  So the web server serves only the `public` directory. This is the recommended Laravel setup.

**Option B – Document root is `public_html`**

1. Upload the whole project into a folder **outside** `public_html`, e.g. `laravel/`.
2. Copy **everything inside** `public/` (including `build/`, `index.php`, etc.) into `public_html/`.
3. Edit `public_html/index.php`:
   - Change  
     `require __DIR__.'/../vendor/autoload.php';`  
     to  
     `require __DIR__.'/../laravel/vendor/autoload.php';`
   - Change  
     `$app = require_once __DIR__.'/../bootstrap/app.php';`  
     to  
     `$app = require_once __DIR__.'/../laravel/bootstrap/app.php';`  
   (Adjust `../laravel` if your project folder name is different.)

### After upload

1. **Create `.env`** in the project root (or in the same place as `bootstrap/`) with production values (APP_URL, DB_*, etc.).
2. **Permissions**:  
   - `storage/` and `bootstrap/cache/` must be writable (e.g. 755 or 775). In File Manager, set permissions for these folders (and subfolders) to writable.
3. **Application key**:  
   - If you didn’t set `APP_KEY` in `.env`, run once (if Hostinger gives you a terminal):  
     `php artisan key:generate`
4. **Caches** (if you have CLI access):  
   `php artisan config:cache`  
   `php artisan route:cache`  
   `php artisan view:cache`

---

## Step 2b: Hostinger VPS (Laravel template / CloudPanel)

Hostinger’s [Laravel VPS](https://www.hostinger.com/laravel-hosting) template comes with PHP, Composer, and often Node. Use it if you have SSH.

### 2b.1 Push code to the server

- **Git**: Clone your repo on the VPS and pull, or push to GitHub/GitLab and clone from the server.
- Or **upload** the project (without `node_modules/`) via SFTP, then run Composer and build on the server.

### 2b.2 On the server (SSH)

```bash
cd /path/to/your/project

# Copy env and edit with your DB and APP_URL
cp .env.example .env
nano .env   # or vim

# Install PHP dependencies
composer install --no-dev --optimize-autoloader

# Build frontend (Node required)
npm ci
npm run build

# Generate key
php artisan key:generate

# Permissions
chmod -R 775 storage bootstrap/cache

# Run migrations
php artisan migrate --force

# Caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2b.3 Web server document root

Point the site’s document root to the `public/` directory of your project (e.g. in CloudPanel or Nginx/Apache config).

---

## Step 3: Database

1. In **Hostinger hPanel**, create a **MySQL** database and user.
2. Put the database name, username, and password in `.env` as `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
3. If you have SSH or run commands on the server:  
   `php artisan migrate --force`  
   Otherwise, you can export your local DB and import it in phpMyAdmin (Hostinger usually provides it).

---

## Step 4: Final checks

- Visit `https://yourdomain.com`. You should see the app, not a directory listing or PHP errors.
- If you see “Vite manifest not found” or blank JS: ensure `public/build/` was uploaded and that `public/build/manifest.json` exists.
- If you see 500 errors: check `storage/logs/laravel.log` and fix `.env` (APP_KEY, DB_*, permissions on `storage` and `bootstrap/cache`).

---

## Quick pre-deploy checklist (run locally)

```bash
npm run build
# Ensure public/build/ exists and is included when you upload
```

Then upload the project (with `public/build/` and without `node_modules/`), configure `.env` and document root as above.
