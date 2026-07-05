# 05 — Security Review

## 🔴 BLOCKER (must fix before AWS production) — 1 item

### S1. Object storage is Replit-only → REQUIRED CHANGE: S3 adapter
`src/lib/objectStorage.ts` talks to a **Replit sidecar** (`127.0.0.1:1106`) via
`@google-cloud/storage` external-account credentials. On AWS that endpoint does
not exist, so **all uploads/media reads fail**.

**Required change (deployment-only, no business logic):** implement an S3-backed
`ObjectStorageService` with the SAME public interface (`getPublicObjectSearchPaths`,
presigned upload/download, ACL check) behind a provider switch. Keep the Replit
path for Replit, select via `OBJECT_STORAGE_PROVIDER`.
- New env: `OBJECT_STORAGE_PROVIDER=s3`, `AWS_REGION`, `S3_BUCKET` (+ IAM role on EC2/ECS — no keys).
- Reuse the existing ACL model (`objectAcl.ts`) as object metadata/tags.
- **This is intentionally NOT auto-written here** (it's a real code change that must ship with its own tests). Recommend a focused PR. Everything else is ready and waits on this.

## 🟠 Must verify at deploy time

| ID | Item | Status / action |
|---|---|---|
| S2 | **Secrets in git** | ✅ none found. Keep secrets in SSM SecureString; the compose env-file is rendered at deploy (chmod 600) and git-ignored. |
| S3 | **HTTPS everywhere** | Terminate TLS at ALB/CloudFront (ACM) or Nginx (certbot). Redirect 80→443. Never serve the API over plain HTTP in prod. |
| S4 | **Clerk keys** | Use `sk_live`/`pk_live` in production (the copy currently uses test keys for trials). Verify webhook/JWKS reachability. |
| S5 | **Paymob webhook** | `PAYMOB_HMAC_SECRET` set; the API verifies HMAC. Expose only the webhook path; keep `PAYMOB_MODE=live` only in prod. |
| S6 | **Payment config encryption** | `PAYMENT_CONFIG_ENCRYPTION_KEY` (32 bytes) — distinct per environment; rotating it invalidates stored provider config. |
| S7 | **IAM least privilege** | Instance role: S3 scoped to the one bucket, SSM read on `/banco/prod/*`, CloudWatch Logs put only. No `*` policies. |
| S8 | **Security groups** | DB reachable ONLY from the app SG; app port ONLY from the web/Nginx SG; 80/443 public. No 5432/8080 open to the world. |
| S9 | **CORS** | Set `CORS_ALLOWED_ORIGINS` to the exact prod origins. Do NOT rely on the Replit-domain fallback on AWS. |

## 🟢 Already good (verified in source)

- **Helmet** security headers on the API; Nginx adds `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`.
- **Rate limiting** middleware applied per route (public vs write limiters).
- **CORS** is an allowlist (credentialed), not `*`.
- **Readiness** returns 503 when the DB is down (LB stops routing) — no traffic to a broken instance.
- **Global crash capture**: unhandled rejection logged (non-fatal), uncaught exception reported then clean exit for orchestrator restart.
- **No secrets logged**; payment provider config encrypted at rest.
- **Container** runs as a non-root user (uid 10001), `tini` for signal handling.
- **Body size** capped (Nginx 60m + API media guard) to bound upload abuse.
