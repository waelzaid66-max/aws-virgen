# NEXT OPS — Redeploy Replit from stabilize branch

**Goal:** Make live API **FRESH** so Device QA / EAS claims are honest.  
**Branch:** `fix/mobile-master-stabilize`  
**Tip commit:** `8778d5b` (+ later tip commits on same branch)  
**Repo:** `https://github.com/waelzaid66-max/-BANCO-CA-OOM-.git`

Live host (`https://banco-ca-oom.replit.app`) is **STALE** until this branch is what the API runs.

**Local guides:**
```powershell
node audit/mobile/scripts/ops-next-step.mjs
node audit/mobile/scripts/post-redeploy-verify.mjs   # after you redeploy
```

---

## 0) Copy-paste on Replit Shell (do this now)

```bash
git fetch origin
git checkout fix/mobile-master-stabilize
git pull --ff-only origin fix/mobile-master-stabilize
pnpm install --frozen-lockfile
pnpm --filter @workspace/db run push-force
```

Then in Replit UI: **Stop** the `api-server` workflow → **Run** it again.

Confirm:
```bash
curl -sS https://banco-ca-oom.replit.app/api/healthz
```

---

## A) On GitHub (optional parallel)

1. Open PR:  
   https://github.com/waelzaid66-max/-BANCO-CA-OOM-/pull/new/fix/mobile-master-stabilize
2. Merge into the branch Replit usually tracks (`main`), **or** keep using checkout in §0.

---

## B) Prove FRESH (from your PC)

```powershell
cd C:\Users\waelz\Downloads\BANCO-CA-OOM
node audit/mobile/scripts/post-redeploy-verify.mjs
```

**Pass (exit 0):**

- `badIsoStatus` ≥ 400 (`market_country=EGYPT` rejected)
- `hasBookable` + `hasPrice` = true on map clusters
- healthz/readyz smoke on the same host

**Note:** `egEqSa` may stay true if all live cars are EG-only — that alone is not STALE after core signals pass.

**Fail (exit 2):** host still on old build — repeat §0.

---

## C) After FRESH only

```powershell
$env:BANCO_API_URL = "https://banco-ca-oom.replit.app"
$env:CLERK_BEARER_TOKEN = "<paste Clerk session JWT>"
node scripts/staging-p0-smoke.mjs

$env:DATABASE_URL = "<staging postgres>"
node scripts/verify-upload-claims-schema.mjs

cd artifacts/banco-mobile
eas build --profile preview --platform android
```

Then Device QA: `audit/mobile/DEVICE-QA-SECTION-COMPANIES.md` + ACCEPTANCE.

**Do not** point smoke at a stopped `*.janeway.replit.dev` URL (404 “Run this app…”).

---

## D) What NOT to do

- Do not claim market/map Device QA green while probe is STALE.
- Do not wait on `banco-web` / website commits — they do not block this path.
- Do not enable Paymob (B5) for this gate.
