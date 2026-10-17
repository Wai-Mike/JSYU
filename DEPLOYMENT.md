# Deploying JSYU to cPanel

The site runs on two hosts from one Laravel app:

| Host | Serves |
|---|---|
| `jsyu.org` | Public site, sign-up, sign-in, email verification, Google sign-in |
| `portal.jsyu.org` | Portal: member area (`/member`) for everyone, management pages for officials |

Both must point at the same `public/` folder.

**Server requirements:** PHP 8.2+ (8.3 recommended) with `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `gd`, `curl`, `zip`, `bcmath`; MySQL 5.7+/MariaDB 10.3+; SSH/Terminal access (cPanel → Terminal).

---

## 1. Build the package (on your computer)

```bash
npm run package:cpanel
```

This builds the frontend, collects only the runtime files, installs production PHP packages into a staging copy and writes **`dist/jsyu-cpanel.zip`**. It never includes `.env`, `node_modules`, `tests` or `public/hot`.

Use `-- --no-vendor` to leave out `vendor/` if you prefer running Composer on the server.

## 2. One-time cPanel setup

1. **PHP version:** cPanel → *MultiPHP Manager* → set `jsyu.org` to PHP 8.3. In *Select PHP Version → Extensions*, make sure the extensions above are ticked.
2. **Database:** cPanel → *MySQL Databases* → create a database and a user, add the user to the database with **All Privileges**. Note the full prefixed names (e.g. `cpuser_jsyu`).
3. **Email:** cPanel → *Email Accounts* → create `noreply@jsyu.org`. Its *Connect Devices* page lists the SMTP server (usually `mail.jsyu.org`, port 465, SSL).
4. **Folder layout** (choose one):

   **Option A (recommended): project outside `public_html`**
   - Upload the zip to your home folder and extract it into `~/jsyu`.
   - Point the main domain at `~/jsyu/public`:
     - If *Domains* lets you edit the document root for `jsyu.org`, set it to `jsyu/public`.
     - Otherwise, in Terminal: `mv ~/public_html ~/public_html.old && ln -s ~/jsyu/public ~/public_html`

   **Option B: everything inside `public_html`**
   - Extract the zip directly into `public_html`. The root `.htaccess` forwards every request into `public/` and blocks `.env`, `composer.*` and other private files.
   - Only use this if option A isn't possible.

5. **Portal subdomain:** cPanel → *Domains* (or *Subdomains*) → create `portal.jsyu.org` with the **same document root** as the main site (`jsyu/public` for option A, `public_html` for option B). Don't let cPanel create a separate `portal.jsyu.org` folder.
6. **SSL:** cPanel → *SSL/TLS Status* → run AutoSSL so both `jsyu.org` and `portal.jsyu.org` have certificates. Then in *Domains*, switch on **Force HTTPS Redirect** for both.

## 3. Configure `.env` (first deploy only)

In the project folder, copy the template and replace every `CHANGE_ME_...` value:

```bash
cd ~/jsyu            # or ~/public_html for option B
cp .env.production.example .env
nano .env            # or edit it in cPanel → File Manager
```

What matters most:

| Setting | Value | Why |
|---|---|---|
| `APP_URL` | `https://jsyu.org` | Links in emails, Google callback |
| `ADMIN_DOMAIN` | `portal.jsyu.org` | Portal host |
| `SESSION_DOMAIN` | `.jsyu.org` (leading dot) | One login across both hosts |
| `APP_DEBUG` | `false` | Never show errors publicly |
| `MAIL_*` | the `noreply@jsyu.org` SMTP details | Verification emails |
| `DB_*` | the database from step 2 | |
| `GOOGLE_*` | from Google Cloud Console | Google sign-in |

## 4. Run the deploy script

```bash
cd ~/jsyu
bash scripts/cpanel-deploy.sh
```

It generates the app key (first run), fixes folder permissions, runs migrations, loads the Jonglei counties/payams/bomas, syncs portal roles, links public storage and caches config/routes/views. Run it after **every** upload.

> **Do not run `php artisan db:seed`** in production. The full seeder creates admin accounts with the password `12345`. The deploy script only loads the geography data.

## 5. Create the first administrator

1. Register normally at `https://jsyu.org/register` and verify the email.
2. In Terminal: `php artisan portal:sync-access --grant-super-admin=you@example.com`
3. Sign in at `https://portal.jsyu.org`. You'll see the management dashboard.

## 6. Google sign-in

Google Cloud Console → *APIs & Services → Credentials* → your OAuth client:

- **Authorised JavaScript origins:** `https://jsyu.org`
- **Authorised redirect URIs:** `https://jsyu.org/auth/google/callback`

If the consent screen is in *Testing* mode, only listed test users can sign in. Publish it for everyone.

---

## Updating the site

1. `npm run package:cpanel`
2. Upload `dist/jsyu-cpanel.zip` and extract it over the existing folder. Your `.env` and `storage/` uploads are kept because the zip contains neither.
3. `bash scripts/cpanel-deploy.sh`

## Checklist after deploying

- [ ] `https://jsyu.org` loads with styles and images
- [ ] Register with email → verification email arrives → link opens `portal.jsyu.org/member/membership`, still signed in
- [ ] Google sign-up → verification email arrives
- [ ] `https://portal.jsyu.org` as a member → member dashboard; as an admin → management dashboard
- [ ] `https://jsyu.org/.env` returns 403/404, never the file

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank white pages, console errors about `localhost:5173` | A `public/hot` file was uploaded. Delete it (the deploy script does this). |
| 500 error | Check `storage/logs/laravel-<date>.log`. Usually a wrong `DB_*` value or missing PHP extension. |
| Signed in on jsyu.org but the portal asks to sign in again | `SESSION_DOMAIN` must be `.jsyu.org`, then `php artisan optimize`. |
| `portal.jsyu.org` shows a cPanel default page | The subdomain's document root isn't the app's `public` folder (step 2.5). |
| Verification email never arrives | Check `MAIL_*`, check spam, and in cPanel → *Email Deliverability* fix SPF/DKIM for `jsyu.org`. |
| "Invalid signature" when clicking an email link | `APP_URL` must be `https://jsyu.org` exactly; run `php artisan optimize` after changing `.env`. |
| Uploaded post images 404 | `public/storage` link is missing: `php artisan storage:link`. |
| Changes to `.env` have no effect | Config is cached: run `php artisan optimize`. |
