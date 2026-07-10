---
name: BANCO browse-category grouping (client)
description: How the 4 user-facing browse categories map onto the 3-value API category enum, and how industrial groups are filtered.
---

# BANCO browse-category grouping

The mobile app shows **4 browse categories** to users: `car`, `real_estate`,
`facilities` (مصانع وأراضي), `materials` (مواد خام وخطوط إنتاج). The API
`category` enum has only **3** values: `car | real_estate | industrial`.

**Rule:** `facilities` and `materials` BOTH map to API `category=industrial` and
are separated by each item's `industrial_type`. Helpers live in
`@workspace/taxonomy/categories` (and mobile `CategoryTabs`): `apiCategoryFor`,
`industrialGroupForCategory`, `FACILITIES_TYPES` / `MATERIALS_TYPES`.

**Server filter (current):** `industrial_type` query param accepts the full
subtype set including `raw_material` (see `INDUSTRIAL_SUBTYPES` in
`artifacts/api-server/src/validators/schemas.ts`). Search/feed/map push the
param into `listing_attributes.industrial_type` via `inArray` — do **not**
client-filter away from the API when browsing a group; send the comma-joined
group list (or a single subtype).

**Historical note:** an older memory claimed the feed param omitted
`raw_material`. That is **obsolete** — the param enum includes it. Prefer the
API filter; client-side group helpers remain for UI chips and Discover only.

**How to apply:**
- For a group category, fetch `category=industrial` with
  `industrial_type=<group join>` from `industrialGroupForCategory`.
- Ads/sponsored items with `industrial_type = null` drop out of typed group
  views when the subtype filter is set. Accepted.
- Create/RFQ forms still use the raw 3-value API category enum (car/real_estate/
  industrial) — do NOT give them facilities/materials as API categories.
- Exact AR category labels are a hard product requirement: سيارات / عقارات /
  مصانع وأراضي / مواد خام وخطوط إنتاج (keys `home.categories.*`).
