# خارطة التسليم — موقع BANCO التكميلي

**التاريخ:** 2026-07-09  
**الحالة:** تنفيذ W0–W2 جزئي — جاهز للتجريب المحدود  
**المبدأ:** الموقع **لا يوقف** الموبايل أو ماركت أو الأدمن عند تعطّله أو سقوطه.

---

## 1. الوضع الحالي (بعد المراجعة العميقة)

| الموجة | التقدّم | ملاحظات |
|--------|---------|---------|
| **W0** عزل CI | ~95% | `ci.yml` لا ي typecheck ويب؛ `ci-website.yml` منفصل؛ boundaries + ESLint ويب |
| **W0.5** tokens | ~70% | `banco-web` + `landing` فقط |
| **W1** SEO hubs | ~96% | AR + EN hubs، sitemap، hreflang، static audit |
| **W2** بحث | ~90% | `/search`، `/listing/[id]`، عقد مشترك؛ live خلف flags |
| **W3** خريطة/فلاتر | ~83% | مكوّنات جاهزة؛ MAP/LIVE معطّلان افتراضياً |
| **W4–W5** | 0% | Clerk، workspace بائع — لم يبدأ |
| **W8** دمج landing | 0% | landing منفصل |

### ضمانات العزل (مُحقَّقة)

- لا imports من `banco-mobile` / `dealer-os` / `admin-os` / `api-server` / `db` في الويب
- متغيرات `NEXT_PUBLIC_*` منفصلة عن `EXPO_PUBLIC_*` و `VITE_*`
- `lib/search-contract` + اختبار parity mobile/web
- فشل build الويب **لا يمنع** CI الأساسي للموبايل/API

### Feature flags (إنتاج آمن)

```env
NEXT_PUBLIC_SEARCH_ENABLED=true          # تعطيل البحث بالكامل → hubs فقط
NEXT_PUBLIC_WEB_SEARCH_LIVE=false      # لا استدعاء API حي للنتائج/الخلاصة
NEXT_PUBLIC_WEB_SEARCH_MAP=false       # لا خريطة Google
```

الخلاصة على الصفحة الرئيسية (`HomeFeedTeaser` / `HomeTrendingStrip`) تعمل **فقط** عند `WEB_SEARCH_LIVE=true`.

---

## 2. فتح/إغلاق الموقع من الأدمن (مستقبلي — W6)

> **لا يُنفَّذ قبل اكتمال W2 staging + تجريب موبايل.** الهدف: تشغيل/إيقاف الويب دون لمس الموبايل أو API.

### التصميم المقترح

```
admin-os  →  PATCH /v1/admin/platform-settings
                    consumer_web_enabled: boolean
                    consumer_web_message_ar?: string
                    consumer_web_message_en?: string

api-server  →  يخزّن الإعداد (DB أو Redis cache)

banco-web   →  middleware أو layout يقرأ:
               - GET /v1/public/site-status (بدون auth)
               - أو CDN edge config (Cloudflare Workers)

عند false  →  صفحة صيانة 503 + Retry-After
               لا يؤثر على /api/v1/* للموبايل
```

### قواعد صارمة

1. **لا kill switch على API** — فقط على `banco-web` CDN/Next
2. **لا تعديل** على `dealer-os` / `admin-os` bundles من كود الويب
3. الأدمن يغيّر flag؛ الويب يقرأ فقط (read-only public endpoint)
4. fallback: إذا فشل قراءة الإعداد → الويب يعمل (fail-open للمستهلك) أو fail-closed حسب قرار المنتج

### بوابة قبل التنفيذ

- [ ] G-W2 staging مستقر 7 أيام
- [ ] mobile regression PASS على نفس SHA
- [ ] اختبار: تعطيل الويب → الموبايل يعمل 100%
- [ ] توثيق runbook للأدمن

---

## 3. مراحل التسليم والتجريب

### المرحلة 1 — تجريب داخلي (الآن → 2 أسابيع)

- نشر `banco-web` على staging CDN
- `WEB_SEARCH_LIVE=false`، `MAP=false`
- smoke: `website-staging-smoke.mjs` + `website-seo-static-audit.mjs`
- فريق QA: hubs AR/EN، مشاركة `/listing/{id}`، روابط `/l/:id` rewrite

### المرحلة 2 — تجريب مع الموبايل (بعد المرحلة 1)

- تفعيل `WEB_SEARCH_LIVE=true` على staging فقط
- golden URLs: نفس `buildSearchParams` mobile vs web (اختبار `mobile-web-parity.test.mjs`)
- مراقبة: لا زيادة أخطاء API من traffic الويب
- checklist: `WEBSITE-MOBILE-INDEPENDENCE-CHECKLIST.md` على كل PR

### المرحلة 3 — إنتاج محدود (soft launch)

- prod CDN مع flags معطّلة
- EN + AR indexed تدريجياً
- Uptime على `/` و `/api/healthz` منفصلان
- **بدون** admin kill switch حتى المرحلة 4

### المرحلة 4 — تحكم تشغيلي

- تنفيذ `consumer_web_enabled` من الأدمن
- runbook + تدريب فريق الدعم
- rollback: CDN cache purge + flag false

### المرحلة 5 — W4/W5 (بائع ويب)

- Clerk على الويب فقط
- `/workspace` — لا يمس mobile auth
- إنشاء إعلان من الويب → يظهر في API → الموبايل يراه تلقائياً

---

## 4. ديون تقنية معروفة (مقبولة مؤقتاً)

| البند | الخطة |
|-------|--------|
| `<html lang>` ثابت `ar` على كل الصفحات | `DocumentLocaleSync` على `/en/*` + هجرة `[locale]` لاحقاً |
| مكوّنات البحث التفاعلية عربية على `/en/search` | W2.1 — تمرير `locale` لـ SearchControls/Facets |
| manifest عربي فقط | W1.3 — manifest مزدوج أو neutral |
| `tsconfig strict: false` في banco-web | تفعيل تدريجي بعد W2 |

---

## 5. تحديثات الوثائق المطلوبة

- [x] هذا الملف (`WEBSITE-DELIVERY-ROADMAP-AR.md`)
- [ ] تحديث `WEBSITE-READINESS-GATES.md` G-W0..G-W2 عند sign-off
- [ ] تحديث `WEBSITE-MASTER-PLAN-AR.md` §9.2: `NEXT_PUBLIC_API_URL` (ليس `API_BASE_URL`)
- [ ] `audit/website/README.md` — إزالة «لا تنفيذ حتى sign-off»

---

## 6. أوامر التحقق قبل كل deploy

```bash
node scripts/verify-website-boundaries.mjs
pnpm --filter @workspace/search-contract run test
pnpm --filter @workspace/banco-mobile run test:lib
pnpm run typecheck:website
pnpm run lint:website
pnpm --filter @workspace/banco-web run build
node scripts/website-seo-static-audit.mjs
node scripts/website-bundle-budget.mjs
# بعد النشر:
BANCO_WEB_URL=https://staging.example.com node scripts/website-staging-smoke.mjs
```

---

**المراجع:** [`WEBSITE-MASTER-PLAN-AR.md`](./WEBSITE-MASTER-PLAN-AR.md) · [`WEBSITE-READINESS-GATES.md`](./WEBSITE-READINESS-GATES.md) · [`WEBSITE-MOBILE-INDEPENDENCE-CHECKLIST.md`](./WEBSITE-MOBILE-INDEPENDENCE-CHECKLIST.md)
