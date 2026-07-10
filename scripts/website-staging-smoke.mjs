#!/usr/bin/env node
/**
 * Lightweight staging smoke for banco-web static routes + SEO files.
 *
 * Usage:
 *   BANCO_WEB_URL=https://staging.banco.example.com node scripts/website-staging-smoke.mjs
 *
 * Optional:
 *   BANCO_LISTING_SMOKE_ID=uuid  — GET /listing/{id} must return 200 + Product JSON-LD
 *
 * Exit: 0 pass, 1 fail, 2 missing BANCO_WEB_URL
 */

const BASE = (process.env.BANCO_WEB_URL || process.env.WEB_URL || "").replace(/\/$/, "");

const PATHS = [
  { path: "/", label: "home", expectJsonLd: "WebSite" },
  { path: "/en", label: "en home", expectJsonLd: "CollectionPage" },
  { path: "/cars", label: "cars hub", expectJsonLd: "CollectionPage" },
  { path: "/en/cars", label: "en cars hub", expectJsonLd: "CollectionPage" },
  { path: "/real-estate", label: "real-estate hub", expectJsonLd: "CollectionPage" },
  { path: "/industrial", label: "industrial hub", expectJsonLd: "CollectionPage" },
  { path: "/search", label: "search" },
  { path: "/en/search", label: "en search" },
  { path: "/search?category=car&location=cairo", label: "search cars cairo" },
  { path: "/robots.txt", label: "robots", kind: "robots" },
  { path: "/sitemap.xml", label: "sitemap", kind: "sitemap" },
  { path: "/api/health", label: "health route", kind: "health" },
  { path: "/manifest.webmanifest", label: "manifest", kind: "manifest" },
];

let failed = 0;

function fail(label, detail) {
  console.error(`[FAIL] ${label}: ${detail}`);
  failed += 1;
}

function pass(label, status) {
  console.log(`[PASS] ${label}: ${status}`);
}

async function checkRoute(item) {
  const url = `${BASE}${item.path}`;
  const before = failed;

  try {
    const res = await fetch(url, { redirect: "follow" });
    if (res.status < 200 || res.status >= 400) {
      fail(item.label, `HTTP ${res.status} (${url})`);
      return;
    }

    const body = await res.text();

    if (item.kind === "sitemap") {
      if (!body.includes("<urlset") && !body.includes("<sitemapindex")) {
        fail(item.label, "missing urlset");
      }
      for (const hub of ["/cars", "/real-estate", "/search"]) {
        if (!body.includes(hub)) {
          fail(item.label, `missing hub ${hub}`);
        }
      }
    } else if (item.kind === "robots") {
      if (!body.toLowerCase().includes("user-agent")) {
        fail(item.label, "missing User-agent");
      }
    } else if (item.kind === "health") {
      let json;
      try {
        json = JSON.parse(body);
      } catch {
        fail(item.label, "invalid JSON");
        return;
      }
      if (json.status !== "ok") {
        fail(item.label, `unexpected payload: ${body.slice(0, 120)}`);
      }
    } else if (item.kind === "manifest") {
      let json;
      try {
        json = JSON.parse(body);
      } catch {
        fail(item.label, "invalid JSON");
        return;
      }
      if (!json.name || json.lang !== "ar") {
        fail(item.label, "missing name or ar lang");
      }
    } else {
      if (!body.includes('lang="ar"')) {
        fail(item.label, 'missing lang="ar"');
      }
      if (item.expectJsonLd && !body.includes(item.expectJsonLd)) {
        fail(item.label, `missing JSON-LD ${item.expectJsonLd}`);
      }
    }

    if (failed === before) {
      pass(item.label, res.status);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    fail(item.label, `${msg} (${url})`);
  }
}

async function checkListing(id) {
  const label = "listing detail";
  const url = `${BASE}/listing/${id}`;
  const before = failed;

  try {
    const res = await fetch(url, { redirect: "follow" });
    if (res.status < 200 || res.status >= 400) {
      fail(label, `HTTP ${res.status} (${url})`);
      return;
    }
    const html = await res.text();
    if (!html.includes("Product")) {
      fail(label, "missing Product JSON-LD");
    }
    if (failed === before) {
      pass(label, res.status);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    fail(label, `${msg} (${url})`);
  }
}

async function main() {
  if (!BASE) {
    console.error("Set BANCO_WEB_URL (or WEB_URL) to the deployed banco-web origin.");
    process.exit(2);
  }

  console.log(`Website smoke → ${BASE}`);
  for (const item of PATHS) {
    await checkRoute(item);
  }

  const listingId = process.env.BANCO_LISTING_SMOKE_ID?.trim();
  if (listingId) {
    await checkListing(listingId);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
