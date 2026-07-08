# Release candidate — final gate

**Date:** 2026-07-08 (strict audit pass)  
**Branch:** `main` @ `a20d6fc`  
**Theme:** Maintenance, deploy/launch documentation, mobile performance/resilience — **no listing publish algorithm changes**.  
**Full report:** [FULL-STRICT-AUDIT-REPORT.md](./FULL-STRICT-AUDIT-REPORT.md)

## Decision

| Environment | Verdict | Notes |
|-------------|---------|-------|
| **Staging (EAS + staging API)** | **GO** | After user supplies staging secrets; run device runbook + publish smoke |
| **Production store / prod API** | **CONDITIONAL NO-GO** | Requires production secrets, EAS prod profile sign-off, and staging publish smoke recorded |

**Overall RC:** **CONDITIONAL GO** — ship to **staging**; production requires human checklist completion below.

## Checklist

| # | Item | Status |
|---|------|--------|
| 1 | `pnpm install` lockfile consistent | CI `--frozen-lockfile`; local OK |
| 2 | Mobile unit tests (`icons`, `lib-hardening`, `mobile-resilience`) | **PASS 23/23** (2026-07-08) |
| 3 | `pnpm run typecheck` (all packages) | **PASS** (~17.5 min Windows) |
| 4 | `pnpm run lint` | **PASS** |
| 5 | `node scripts/production-confidence-check.mjs --skip-typecheck` | **PASS 10/10** |
| 6 | CI workflow on GitHub Actions | **Verify** — `gh auth login` locally blocked |
| 7 | API vitest (Postgres) | **CI only** — not run on Windows dev |
| 8 | Listing publish smoke on staging device | **Human** — required |
| 9 | Production GCP + EAS secrets not in repo | **User staging-only** |
| 10 | `audit/rc1/*.log` excluded from release commit | Yes |

## Listing publish

See [PHASE-LISTING-PUBLISH-LIFECYCLE.md](./PHASE-LISTING-PUBLISH-LIFECYCLE.md) — **publish safe** for this diff scope.

## Blockers (production)

- Real `EXPO_PUBLIC_*` / API URLs and auth secrets for production
- EAS credentials and production build profile validation
- Optional: full API vitest if api-server deploy planned same window

## Approvals

- Engineering: consolidation docs + CI path — automated pass pending tests
- Product/Ops: staging publish smoke — pending
