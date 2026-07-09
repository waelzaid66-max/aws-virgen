// Production-hardening regression guards for rental host + notification deep-links.
// Zero-dependency (node:test). Run with:
//   pnpm --filter @workspace/banco-mobile run test:lib

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.dirname(__dirname);

const RENTAL_HOST = path.join(APP_ROOT, "lib", "rentalHost.ts");
const NOTIF_ROUTING = path.join(APP_ROOT, "lib", "notificationRouting.ts");
const PROFILE = path.join(APP_ROOT, "app", "(tabs)", "profile.tsx");
const LAYOUT = path.join(APP_ROOT, "app", "_layout.tsx");

test("rentalHost treats is_bookable === true as bookable", () => {
  const src = fs.readFileSync(RENTAL_HOST, "utf8");
  assert.match(
    src,
    /is_bookable\s*===\s*true/,
    "rentalHost must gate on is_bookable === true (furnished daily marketplace only)",
  );
  assert.match(
    src,
    /filterBookableListings/,
    "rentalHost must export filterBookableListings for profile hub visibility",
  );
});

test("booking notifications route hosts to /bookings?role=host", () => {
  const src = fs.readFileSync(NOTIF_ROUTING, "utf8");
  assert.match(
    src,
    /type\s*===\s*["']booking["'][\s\S]*pathname:\s*["']\/bookings["'][\s\S]*role:\s*["']host["']/,
    "booking notifications must deep-link to host booking inbox",
  );
});

test("payment and subscription notifications route to billing hub", () => {
  const src = fs.readFileSync(NOTIF_ROUTING, "utf8");
  assert.match(src, /payment_success/, "payment_success type must be handled");
  assert.match(src, /payment_failed/, "payment_failed must route to billing hub");
  assert.match(src, /subscription_expiring/, "subscription_expiring must be handled");
  assert.match(
    src,
    /return\s+["']\/billing["']\s+as\s+Href/,
    "billing-related notifications must open /billing full page",
  );
});

test("rental hub is a registered stack route", () => {
  const layout = fs.readFileSync(LAYOUT, "utf8");
  assert.match(layout, /name="rentals\/hub"/, "rentals/hub must be in root stack");
  const profile = fs.readFileSync(PROFILE, "utf8");
  assert.match(profile, /\/rentals\/hub/, "profile menu must link to rental hub");
});

test("profile Payments menu opens billing hub (wallet remains linked inside)", () => {
  const src = fs.readFileSync(PROFILE, "utf8");
  assert.match(
    src,
    /profile\.menuWallet[\s\S]*router\.push\(\s*["']\/billing["']\s+as\s+Href\s*\)/,
    "profile Payments entry must open /billing without removing /wallet screen",
  );
});

test("billing, wallet, and invoices are registered stack routes", () => {
  const src = fs.readFileSync(LAYOUT, "utf8");
  const routes = ["billing", "wallet", "invoices", "invoices/[id]"];
  for (const route of routes) {
    const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      src,
      new RegExp(`name="${escaped}"`),
      `_layout.tsx must register Stack.Screen for ${route}`,
    );
  }
});

test("billing hub exposes monthly CSV export", () => {
  const src = fs.readFileSync(path.join(APP_ROOT, "app", "billing.tsx"), "utf8");
  assert.match(
    src,
    /exportBillingReportCsv/,
    "billing hub must call exportBillingReportCsv for statement export",
  );
  assert.match(src, /testID="billing-export-csv"/, "billing export control must be testable");
});

test("invoice detail exposes PDF download", () => {
  const src = fs.readFileSync(path.join(APP_ROOT, "app", "invoices", "[id].tsx"), "utf8");
  assert.match(src, /downloadInvoicePdf/, "invoice detail must support PDF export");
  assert.match(src, /testID="invoice-download-pdf"/, "invoice PDF button must be testable");
});

test("real-estate engines include facet-gated property_type chips", () => {
  const src = fs.readFileSync(path.join(APP_ROOT, "constants", "engines.ts"), "utf8");
  for (const key of ["duplex", "penthouse", "studio", "office", "commercial_land"]) {
    assert.match(
      src,
      new RegExp(`key:\\s*"${key}"[\\s\\S]*?requiresFacet:\\s*true`),
      `${key} engine must be facet-gated`,
    );
  }
});

test("search params wire near-me geo to API client", () => {
  const src = fs.readFileSync(path.join(APP_ROOT, "lib", "searchParams.ts"), "utf8");
  assert.match(src, /nearMeEnabled/, "SearchCriteria must track near-me toggle");
  assert.match(src, /sp\.near_lat/, "buildSearchParams must send near_lat");
  assert.match(src, /sp\.radius_km/, "buildSearchParams must send radius_km");
});

test("search tab uses market-scoped rental taxonomy adapter", () => {
  const search = fs.readFileSync(path.join(APP_ROOT, "app", "(tabs)", "search.tsx"), "utf8");
  const sheet = fs.readFileSync(
    path.join(APP_ROOT, "components", "search", "FilterSheet.tsx"),
    "utf8",
  );
  assert.match(search, /rentalTermsForSearch/, "search tab must use searchTaxonomy adapter");
  assert.match(search, /MARKET_COUNTRIES/, "search tab must expose per-market rental chips");
  assert.match(sheet, /rentalTermsForSearch/, "FilterSheet must use market-scoped rental terms");
  assert.match(sheet, /filter-near-me/, "FilterSheet must expose near-me control");
});

test("create taxonomy includes engine-aligned commercial property types", () => {
  const src = fs.readFileSync(
    path.join(APP_ROOT, "constants", "listingCreateTaxonomy.ts"),
    "utf8",
  );
  assert.match(src, /commercial_land/, "PROPERTY_TYPES must include commercial_land");
  assert.match(src, /warehouse/, "PROPERTY_TYPES must include warehouse");
});
