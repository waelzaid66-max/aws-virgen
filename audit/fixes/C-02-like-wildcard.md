# C-02 — SQL LIKE Wildcard in Upload Serve

**Date:** 2026-07-07  
**Severity:** CRITICAL  
**Status:** FIXED

## Problem

`isLegacyListingMedia()` built a LIKE pattern as `%/api/v1/uploads/objects/${wildcardPath}`. If `wildcardPath` contained `%` or `_`, PostgreSQL LIKE semantics could match unrelated listing media rows and grant public serve access.

## Solution

Escape `\`, `%`, and `_` in the user-supplied path segment and pass escape char `'\\'` to Drizzle `like()`.

## Files changed

- `artifacts/api-server/src/lib/sqlLikeEscape.ts` — `escapeLikeLiteral()` (unit-tested)
- `artifacts/api-server/src/controllers/uploadController.ts` — escaped LIKE

## Verification

- Automated: `artifacts/api-server/src/lib/sqlLikeEscape.test.ts` (in `pnpm run confidence`)
- Manual: request serve path with `%` in segment should not match broader URLs
