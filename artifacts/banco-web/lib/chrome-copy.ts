import type { SiteLocale } from "./hub-config";
import { localizedPath } from "./hub-config";

export type ChromeCopy = {
  brandAria: string;
  navAria: string;
  search: string;
  cars: string;
  realEstate: string;
  industrial: string;
  market: string;
  admin: string;
  browse: string;
  generalSearch: string;
  platforms: string;
  marketLabel: string;
  marketSoon: string;
  adminLabel: string;
  adminSoon: string;
  app: string;
  androidSoon: string;
  iosSoon: string;
  localeSwitch: string;
  homeHref: string;
  searchHref: string;
  carsHref: string;
  realEstateHref: string;
  industrialHref: string;
};

const COPY: Record<SiteLocale, ChromeCopy> = {
  ar: {
    brandAria: "BANCO الرئيسية",
    navAria: "التنقل الرئيسي",
    search: "بحث",
    cars: "سيارات",
    realEstate: "عقارات",
    industrial: "صناعي",
    market: "ماركت",
    admin: "لوحة التحكم",
    browse: "تصفح",
    generalSearch: "بحث عام",
    platforms: "المنصات",
    marketLabel: "بانكو ماركت",
    marketSoon: "بانكو ماركت (قريباً)",
    adminLabel: "الإدارة",
    adminSoon: "الإدارة (قريباً)",
    app: "التطبيق",
    androidSoon: "Android (قريباً)",
    iosSoon: "iOS (قريباً)",
    localeSwitch: "English",
    homeHref: "/",
    searchHref: "/search",
    carsHref: "/cars",
    realEstateHref: "/real-estate",
    industrialHref: "/industrial",
  },
  en: {
    brandAria: "BANCO home",
    navAria: "Main navigation",
    search: "Search",
    cars: "Cars",
    realEstate: "Real Estate",
    industrial: "Industrial",
    market: "Market",
    admin: "Admin",
    browse: "Browse",
    generalSearch: "Search",
    platforms: "Platforms",
    marketLabel: "BANCO Market",
    marketSoon: "BANCO Market (soon)",
    adminLabel: "Admin",
    adminSoon: "Admin (soon)",
    app: "App",
    androidSoon: "Android (soon)",
    iosSoon: "iOS (soon)",
    localeSwitch: "العربية",
    homeHref: "/en",
    searchHref: "/en/search",
    carsHref: "/en/cars",
    realEstateHref: "/en/real-estate",
    industrialHref: "/en/industrial",
  },
};

export function chromeCopy(locale: SiteLocale): ChromeCopy {
  return COPY[locale];
}

export function alternateLocalePath(pathname: string): string {
  // Listings are locale-neutral — same URL for AR and EN.
  if (pathname.startsWith("/listing/")) return pathname;

  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  if (isEn) {
    if (pathname === "/en") return "/";
    if (pathname === "/en/search") return "/search";
    return pathname.replace(/^\/en/, "") || "/";
  }
  if (pathname === "/search") return "/en/search";
  return localizedPath(pathname, "en");
}
