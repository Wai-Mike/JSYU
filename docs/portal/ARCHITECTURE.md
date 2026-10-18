# JSYU Management Portal — Architecture & Plan

Status as of 2026-10-17. Phase 0 (audit) and Phase 1 (foundation & organisational management) are done; later phases are planned, not started.

---

## 1. Existing application (before Phase 1)

**Stack:** Laravel 12, Inertia 2 + React 19, Tailwind 4, Vite. SQLite locally; MySQL on Hostinger in production. Ziggy for routes. Sanctum installed but unused (`routes/api.php` is empty).

**Hosts:** public site on `APP_URL`; portal on `ADMIN_DOMAIN` for everyone: management pages (`routes/admin.php`) for holders of `portal.access`, the member area under `/member` (`routes/member.php`) for all signed-in users. Shared session cookie via `SESSION_DOMAIN`; without one (local `localhost`) `AppSupportSessionHandoff` carries the sign-in over.

**What works and is reused**

| Area | Reused as-is |
|---|---|
| Auth | Email/password login & registration, email verification, password reset, separate admin login page. Google sign-in is moving from Socialite to Firebase (in progress in the working tree; not touched by this work). |
| Content | `posts` (article / program / announcement / resource), comments, reactions, member-submitted drafts, admin approval. This is the base for Announcements & Advertisements (Phase 7) rather than a new publishing system. |
| Infra | Database queue + `jobs` tables, database cache, `composer run dev` (server, queue, Vite). |
| UI | JSYU design tokens in `resources/css/app.css`; admin kit in `resources/js/components/admin`. |

**What was missing:** roles beyond `users.role ∈ {student, admin}`, any permission or policy layer, geographic or organisational data, people records separate from logins, audit logging, private file storage, every module in Parts 3–14.

## 2. Findings

### Security (ordered by severity)

1. **Stored XSS — open.** `resources/js/pages/blog/show.jsx` renders `post.content` with `dangerouslySetInnerHTML`, and any registered member can submit a post. Phase 1 makes publishing a separate permission, so content only goes live after a publisher approves it, but malicious HTML would still run once approved. **Fix:** sanitise on save and render (e.g. `symfony/html-sanitizer`). Not done here because it adds a Composer dependency while `composer.json`/`composer.lock` carry someone else's uncommitted changes.
2. **Seeded admin passwords.** `database/seeders/UserSeeder.php` creates two real admin accounts with password `12345`. Never run it in production; rotate those passwords if it ever was.
3. **No authorization layer — fixed.** Any `admin` could do anything, including promoting any user, with no audit trail. Replaced by permissions + jurisdiction scoping + audit (below).
4. **Over-shared user data — fixed.** The full `User` model (OAuth IDs, date of birth…) was sent to every page. Now only `id, name, email, avatar, role`.
5. **Post filter bug — fixed.** In admin post search an ungrouped `orWhere` bypassed the type/status filters.
6. **Hardcoded admin email** in the old Users page — removed with the rewrite.
7. Google sign-up via the legacy Socialite controller sets `role = 'user'`, which violates the `users.role` enum. This will fail on MySQL strict mode. Moot once Firebase replaces it.

### Other issues

- **Test suite:** most existing tests come from another project (they reference `/dashboard`, `/api/posts`, `user_type`, `account_type`, …) and fail for reasons unrelated to this app. Before Phase 1: 5 of 126 passed. After: 69 of 179, including the 43 new portal tests. **Recommendation:** delete or rewrite the stale tests so CI signal is meaningful.
- Leftover naming from the previous project: `Student*` controllers/layouts, `role:student` middleware.
- **Parallel edits:** another tool edited the same admin files during this phase. Commit in small steps to avoid overwrites.

## 3. Architecture

**Modular monolith** inside this Laravel app. Module boundaries are directories rather than packages:

```
app/Models/                     shared entities (flat, Laravel default)
app/Models/Concerns/HasHierarchyPath.php
app/Services/Access/            AccessControl, AccessRegistry, RoleAssignmentService
app/Services/Audit/             AuditLogger
app/Services/Documents/         DocumentStorage (private files)
app/Services/Organisation/      AppointmentService
app/Policies/                   one policy per scoped model (auto-discovered)
app/Http/Controllers/Admin/<Module>/
app/Http/Requests/Admin/<Module>/
resources/js/components/admin/  shared portal UI kit
resources/js/pages/admin/<module>/
config/portal.php               permissions, roles, levels, unit types, document rules
```

### Identity & access

- **No permission package.** None was installed, and the requirement is per-assignment jurisdiction ("County Coordinator for Bor South"). Spatie's teams model allows one team context per request, so a small purpose-built layer fits better.
- Tables: `roles`, `permissions`, `permission_role`, `role_assignments(user_id, role_id, geographic_area_id NULL = state-wide)`.
- **Scoped vs state-wide permissions** (`config/portal.php → scoped`). A grant for an area applies to that area and everything below it, and only for scoped permissions. Administration permissions (users, roles, audit, content) only count when held state-wide.
- **Checks** go through `AccessControl`:
  - `allows(user, perm, area)` decides for a single record;
  - `scopeQuery(query, user, perm)` filters lists, so county and payam isolation also applies to lists, not just single records;
  - every permission is also a Gate ability.
- **No escalation.** You can only assign a role, or change a role's permissions, if you hold every permission involved state-wide. The last Super Administrator can't be removed. Super Administrator is state-wide only and always holds every configured permission. It does not get a blanket `Gate::before` bypass, so future sensitive permissions (secret ballots, sensitive census fields) can be withheld from it.
- **`users.role` is kept** as a derived "account type": `admin` when the user holds `portal.access` anywhere, otherwise `student`. The existing post-login redirects (eight places, including the Firebase controller) keep working unchanged. Real authorization never reads it.

### Geography & organisation

- `geographic_areas`: state → county → payam → boma. Allowed child levels are enforced, and a materialised `path` (`/1/4/`) makes "inside this county?" a prefix check.
- `organisation_units`: headquarters, offices, departments, committees, working groups. Each has its own hierarchy, optionally tied to an area, which places it in that jurisdiction.
- **Person ≠ position ≠ appointment.**
  - `people` is one profile per individual (unique email), optionally linked to one login.
  - `positions` belong to a unit, with a seat count and an optional term length.
  - `appointments` are the history: active or ended, with reason, appointed/ended by, and a link to the appointment they replace. They are never deleted.
- `documents` is polymorphic and stored on the private `local` disk under random names; downloads go through an authorised controller and are audited.
- **Nothing authoritative is seeded.** Counties, payams, offices and position titles are governance data that admins enter. Only the software's roles and permissions are seeded.

### Audit

`audit_logs` is append-only, written via `AuditLogger::log()`. Keys like `password`, `token`, `secret` and `notes` are redacted. Every privileged Phase 1 action is logged: role assign/revoke, role permission edits, area/unit/position create/update/delete, appointment create/end/transfer, document upload/download/delete, post publish/delete.

## 4. Implementation plan

| Phase | Depends on | Scope summary | Key risks |
|---|---|---|---|
| **0** Audit | — | This document | — |
| **1** Foundation ✅ | 0 | Access control, geography, org units, positions, appointments, people, audit, private documents, role-aware portal | Parallel edits to the same files |
| **2** Contacts & stakeholders | 1 | Extend `people` (no second contact table): organisation/title/category/status, external orgs table, contact groups, import with duplicate detection, permission-gated export (`contacts.export` separate from view) | Duplicates between members and officials. Mitigated by the single `people` table + `user_id` link |
| **3** Tasks | 1 (people, units) | One `tasks` module (polymorphic `related_to`) reused by meetings/projects; statuses incl. *Submitted for review* ≠ *Completed*; reassignment history; notifications via queue | Scope creep into per-module task systems |
| **4** Membership | 1, 2 | `membership_applications` with status history; officer review queue; eligibility rules from approved regulations | Rules not yet approved by the Union |
| **5** Youth census ✅ (online) | 1, 4 | Campaigns, enumerator assignments by area, review workflow, duplicate checks, aggregate reports; offline only after online acceptance | Sensitive data; legal basis & retention must be approved first |
| **6** Bulk email | 2, 4 | Campaigns → per-recipient rows → chunked queued jobs, idempotent dispatch, suppression/unsubscribe, webhooks | Provider limits; consent |
| **7** Announcements & ads | 6 (optional notify) | Extend `posts` with category/audience/publish window/expiry; reuse the approval flow | — |
| **8** Meetings & operations | 3 | Meetings, minutes, resolutions register; action items create tasks; correspondence/document register | — |
| **9** Programs & projects | 3 | The eight program categories; projects with milestones → tasks | — |
| **10** Elections ✅ (core) | 4 | **Decision 2026-10-18: members vote online** (this replaces the earlier admin-only plan). Built: ballot setup, secret online voting by approved members, sealed results, separate certification. Still to do: nominations, voter-roll freeze, disputes | Needs approved election rules; see "Census & elections" below |
| **11** Reporting | all | Role/area-scoped dashboards, exports honouring `scopeQuery` | Census figures ≠ total youth population |
| **12** Hardening | all | Security review, load/indexing, accessibility, backups, queue workers | — |

**Recommended next step:** fix the stored XSS (finding 1) and clean up the stale tests, then start Phase 2. Contacts build directly on `people` and are needed by tasks, membership and communications.

## Census & elections (2026-10-18)

**Census.** Campaigns go draft → open → closed. Enumerators (`census.collect`) enter records only while a campaign is open, only for areas inside both the campaign and their own assignment. Each record is identity, education, employment and skills, plus disability and displacement. Supervisors (`census.review`) approve records or return them for correction; nobody reviews their own entries. A likely duplicate (same name in the campaign with a matching date of birth, phone, or area and sex) must be confirmed before saving. Reports count approved records only, inside the viewer's `census.view` area.

Disability and displacement need `census.sensitive`, which is state-wide only and held by no role except Super Administrator by default. Enumerators enter those answers but cannot read them back. The audit log stores record ids, never names.

**Elections.** Elections go draft → open → closed → published. The ballot (positions, seats, candidates) is fixed once voting opens. Eligible voters are approved members with a login whose home area is inside the election's area. Ballot secrecy:

- `election_voters` records who voted, with a unique key that blocks double voting even under concurrent requests;
- `election_votes` stores the choices with no user id, no timestamps and random UUIDs, inserted in shuffled order.

Results are hidden from officers until voting closes, and from members until someone with `elections.certify` publishes them. That is a separate permission from `elections.manage`.

**Known limits:**

- The electorate isn't frozen. Eligibility is checked when a member votes, and turnout uses the current electorate.
- Someone with direct database access plus query logs could still correlate the two tables.
- There are no nominations, disputes or offline census collection yet.
- Census reports load approved records into memory. That is fine for tens of thousands of records; move it to SQL aggregation before going beyond that.

## 5. Phase 1 results

**Migrations** (additive; rollback tested on a copy of the dev database):

- `2026_10_17_100000_create_access_control_tables`: geographic_areas, roles, permissions, permission_role, role_assignments, audit_logs
- `2026_10_17_100100_create_organisation_tables`: organisation_units, people, positions, appointments, documents
- `2026_10_17_100200_seed_portal_access`: syncs roles and permissions, and gives every existing `role = admin` user Super Administrator

**Permissions:** `portal.access`, `geography.view|manage`, `organisation.view|manage`, `positions.manage`, `appointments.view|manage|documents`, `people.view|manage`, `content.manage|publish`, `users.view`, `roles.assign|manage`, `audit.view`. Twelve starter roles are defined in `config/portal.php`. Roles for modules that don't exist yet (census, membership, elections…) only get `portal.access` and basic view permissions for now.

**Portal pages:** Dashboard, Structure (list + unit page with positions, holders and vacancies), Leadership & Officials (current, history, vacancies; appointment page with end, transfer and documents), People, Geography, Website Posts, Users (role assignment), Roles & Permissions, Audit Logs. Navigation shows only permitted items.

**Tests:** `tests/Feature/Portal`, 43 tests. They cover:

- state vs county vs payam isolation;
- unscoped permissions on areas having no effect;
- scoped list filtering;
- hierarchy moves and cycle prevention;
- seat limits;
- duplicate holders;
- term defaults;
- end/transfer history;
- cross-county appointment denial;
- private document access;
- role escalation prevention;
- last-super-admin protection;
- content publish separation;
- audit redaction;
- admin-login gating;
- page rendering.

Run with `php artisan test tests/Feature/Portal`.

**Not done / limitations**

- Notifications, a global search across modules, and exports are not built yet. They arrive with the modules that need them.
- No organisational data is seeded; the portal starts empty apart from roles.
- Frontend lint isn't wired: `eslint.config.js` doesn't match `.jsx` files. The build passes, and the pages were checked through the page-render tests, not in a browser.

## 6. Configuration & deployment

| Setting | Purpose |
|---|---|
| `ADMIN_DOMAIN` | Portal host for officials and members (defaults to `portal.<APP_URL host>`) |
| `SESSION_DOMAIN` | Leading-dot domain so one login works on both hosts |
| `PORTAL_DOCUMENTS_DISK` | Disk for private attachments (default `local` → `storage/app/private`; never `public`) |

Deploy steps:

1. `php artisan migrate --force`. Creates the tables, then makes existing admins Super Administrators.
2. Optionally, `php artisan portal:sync-access --grant-super-admin=you@example.org`.
3. Make sure `storage/app/private` is writable and **not** web-accessible.
4. Rebuild assets: `npm run build`.

After editing `config/portal.php`, run `php artisan portal:sync-access`. It only adds missing roles and permissions; grants changed in the portal are kept.
