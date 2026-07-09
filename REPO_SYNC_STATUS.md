# BANCO — حالة مزامنة الريبوهات (نسخة الإنتاج)

**التاريخ:** 2026-07-08 (موجة إغلاق — PR #5 مدمج)  
**HEAD على `main` (origin):** `482eb34` (أو أحدث بعد `fix(publish)`)

## GitHub Actions CI على `main`

| Run | الحالة |
|-----|--------|
| [28978878224](https://github.com/waelzaid66-max/-BANCO-CA-OOM-/actions/runs/28978878224) | ✅ 5/5 (Typecheck، API tests، ESLint، GCP gate، Mobile) |

**Tag مستهدف:** `v1.0.0-rc.2`

**أداة دفع المرآات:** `scripts/push-mirror-remotes.sh`  
**أداة aws-virgen:** `scripts/publish-aws-virgen-rc.sh v1.0.0-rc.2`

---

## الريموتات

| الاسم | GitHub URL | دور | `main` @ |
|-------|------------|-----|----------|
| **origin** | `waelzaid66-max/-BANCO-CA-OOM-` | مصدر العمل | `482eb34` ✅ |
| **aws-virgen** | `waelzaid66-max/aws-virgen` | AWS EC2/CD | **يدوي** — merge جاهز؛ الدفع يتطلب `gh auth` كمالك (ليس cursor[bot]) |
| **bbanco** | `waelzaid66-max/b-banco` | مرآة | شغّل `push-mirror-remotes.sh` |
| **bdeals** | `waelzaid66-max/b.deals` | deploy | شغّل `push-mirror-remotes.sh` |
| **boom** | `waelzaid66-max/B-OOM` | B-OOM | شغّل `push-mirror-remotes.sh` |

> Cloud Agent يدمج محلياً لـ virgen لكن **لا يستطيع push** — GitHub يفرض هوية `cursor[bot]` على git push.

---

## تقارير التشغيل (Replit + GCP + AWS)

| التقرير | المسار |
|---------|--------|
| تسليم الوكيل | `release/PRIMARY_AGENT_HANDOFF.md` |
| تشغيل موحّد | `release/REPLIT_GOOGLE_AWS_UNIFIED_RUNBOOK.md` |
| GCP كامل | `deploy/gcp/reports/00-README.md` |
| مشغّلات Google | `deploy/gcp/TRIGGER_MIGRATION.md` |
| AWS | `deploy/aws/reports/00-README.md` |
| فهرس النشر | `docs/DEPLOYMENT_GUIDES.md` |

---

## أوامر الإغلاق على Replit (مالك المستودع)

```bash
git pull origin main
gh auth status   # يجب حساب waelzaid66-max وليس bot

export AWS_VIRGEN_SYNC_TOKEN="$(gh auth token)"   # PAT بصلاحية repo على aws-virgen
./scripts/publish-aws-virgen-rc.sh v1.0.0-rc.2

./scripts/push-mirror-remotes.sh

pnpm install --frozen-lockfile
pnpm run typecheck && pnpm run lint && pnpm run confidence
pnpm --filter @workspace/api-server test
```

---

## قرار الإصدار

| النطاق | الحكم |
|--------|--------|
| كود + CI على الأساسي | **GO** |
| aws-virgen + مرآات | **GO** بعد أوامر الدفع أعلاه |
| GCP Console triggers + أسرار حية | **GO WITH FIXES** |
| متاجر عالمية | **NO GO** حتى OPS (EAS، smoke staging) |

*يُحدَّث بعد كل دفع.*
