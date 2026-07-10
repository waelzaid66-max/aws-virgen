export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return "http://localhost:5000";
}

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return "http://localhost:3000";
}

export function getMarketUrl(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_MARKET_URL?.trim();
  return fromEnv ? fromEnv.replace(/\/+$/, "") : null;
}

export function getAdminUrl(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();
  return fromEnv ? fromEnv.replace(/\/+$/, "") : null;
}

export function getAppStoreUrls(): { android: string | null; ios: string | null } {
  const android = process.env.NEXT_PUBLIC_APP_ANDROID_URL?.trim() || null;
  const ios = process.env.NEXT_PUBLIC_APP_IOS_URL?.trim() || null;
  return { android, ios };
}

/** Public SEO share URL (`/l/:id`) — proxied to API via Next/nginx. */
export function getPublicListingShareUrl(listingId: string): string {
  return `${getSiteUrl()}/l/${listingId}`;
}

/** Deep link matching mobile scheme (`bancooom://listing/:id`). */
export function getAppListingDeepLink(listingId: string): string {
  return `bancooom://listing/${listingId}`;
}
