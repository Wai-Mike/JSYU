# Firebase Google Authentication Setup

This application uses **Firebase Authentication (Google provider)** on the frontend and **Laravel session authentication** on the backend. Firebase never authorizes application routes by itself — Laravel verifies the Firebase ID token, then creates a normal web session.

## Architecture

1. User clicks **Continue with Google** on `/login` or `/register`.
2. Firebase JS SDK opens a Google popup (`signInWithPopup`).
3. Frontend obtains a Firebase **ID token**.
4. Frontend posts `{ id_token }` to `POST /auth/firebase/google` (CSRF-protected).
5. Laravel verifies the token with the Firebase Admin SDK (`kreait/firebase-php`).
6. Laravel finds or creates a local `users` row using the verified `firebase_uid`.
7. Laravel calls `Auth::login()`, regenerates the session, and redirects.

Existing email/password accounts are **not** auto-linked by email. Users must sign in with their password and call `POST /auth/firebase/link` while authenticated.

## Firebase Console setup

1. Open [Firebase Console](https://console.firebase.google.com/) and select your project.
2. Go to **Build → Authentication → Sign-in method**.
3. Enable **Google** and set a support email.
4. Go to **Project settings → Your apps** and register a **Web** app if you have not already.
5. Copy the web config values into `.env` as `VITE_FIREBASE_*`.
6. Under **Authentication → Settings → Authorized domains**, add:
   - `localhost`
   - your production domain (for example `jsyu.org`)
7. Create a service account for Admin verification:
   - Project settings → **Service accounts**
   - Generate a new private key (JSON)
   - Store it outside git, e.g. `storage/app/firebase/service-account.json`
   - Set `FIREBASE_CREDENTIALS` to that absolute path (or paste the JSON string)

Firebase’s Google provider uses Google Cloud OAuth clients managed by Firebase. You normally do **not** need a separate Google Cloud OAuth client for this popup flow.

## Environment variables

### Frontend (Vite — public)

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
```

### Backend (private)

```dotenv
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CREDENTIALS=D:\path\to\service-account.json
FIREBASE_CHECK_REVOKED=false
```

Never commit service-account JSON. `storage/app/firebase/*.json` is gitignored.

## Local development

```bash
composer install
npm install
cp .env.example .env   # if needed
# fill Firebase env vars
php artisan migrate
npm run dev
php artisan serve
```

Then visit `/login` → **Continue with Google**.

## Production deployment

1. Use HTTPS for the site and authorized domain.
2. Set all `VITE_FIREBASE_*` and `FIREBASE_*` variables on the server.
3. Place the service-account JSON on the server with restricted filesystem permissions.
4. Build assets: `npm run build`
5. Clear caches:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan migrate --force
```

6. Confirm login and logout on production.

## Routes

| Method | Path | Name | Purpose |
|--------|------|------|---------|
| POST | `/auth/firebase/google` | `auth.firebase.google` | Guest login / registration via ID token |
| POST | `/auth/firebase/link` | `auth.firebase.link` | Link Google to authenticated user |
| POST | `/auth/firebase/unlink` | `auth.firebase.unlink` | Unlink Google (requires password) |
| POST | `/logout` | `logout` | End Laravel session (frontend also clears Firebase client auth) |

Rate limit: `throttle:10,1` on Firebase auth endpoints.

## Account policy

| Case | Behavior |
|------|----------|
| Known `firebase_uid` | Log in |
| New email + new Firebase UID | Create `student` account (public registration) |
| Email already exists without Firebase link | Reject; ask user to password-login then link |
| Unlink with no password | Reject (prevents lockout) |

Admin privileges are never granted from Google email domains.

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| “Firebase is not configured” | Missing `VITE_FIREBASE_*` vars; restart Vite after changing `.env` |
| `auth/unauthorized-domain` | Domain not in Firebase authorized domains |
| `auth/popup-blocked` | Browser blocked the popup |
| “Google authentication failed” | Invalid/expired ID token, wrong Admin credentials, or project mismatch |
| “An account with this email already exists…” | Password account already owns that email — link after password login |
| Admin credentials errors | `FIREBASE_CREDENTIALS` path wrong or JSON invalid |

## Manual verification checklist

- [ ] Google popup opens on login and register
- [ ] New Google user lands on home authenticated
- [ ] Returning Google user logs in without creating a second row
- [ ] Existing password user cannot be taken over via Google alone
- [ ] Password login still works
- [ ] Logout clears Laravel session and does not immediately re-login
- [ ] Service-account JSON is never exposed in HTML/JSON responses
