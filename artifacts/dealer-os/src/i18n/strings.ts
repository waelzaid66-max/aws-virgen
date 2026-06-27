/**
 * Banco Market (dealer-os) UI translations — English + Arabic.
 *
 * App-chrome + page strings live here; TAXONOMY labels (categories, brands,
 * locations, industrial types) come from @workspace/taxonomy (already bilingual)
 * so they never drift from the mobile app or the DB. Keys are dot-paths resolved
 * by `t()` (see ./LanguageContext); use `{name}` placeholders for interpolation.
 *
 * Translated incrementally, surface by surface. Any key missing from `ar` falls
 * back to the key string, so partial coverage never crashes — it just shows the
 * key until translated.
 */
export type Lang = "en" | "ar";

export const STRINGS: Record<Lang, Record<string, unknown>> = {
  en: {
    brand: "BANCO Market",
    nav: {
      dashboard: "Dashboard",
      listings: "Listings",
      leads: "Leads",
      rfqs: "RFQs",
      globalSupply: "Global Supply",
      investments: "Investments",
      company: "Company",
      analytics: "Analytics",
      ads: "Ads",
      import: "Import",
      wallet: "Wallet",
      subscription: "Subscription",
    },
    common: {
      signOut: "Sign Out",
      marketSuffix: "Market",
      seller: "Seller",
      dealer: "dealer",
      switchToArabic: "العربية",
      switchToEnglish: "English",
    },
  },
  ar: {
    brand: "بانكو ماركت",
    nav: {
      dashboard: "لوحة التحكم",
      listings: "الإعلانات",
      leads: "العملاء المحتملون",
      rfqs: "طلبات الأسعار",
      globalSupply: "التوريد العالمي",
      investments: "الاستثمارات",
      company: "الشركة",
      analytics: "التحليلات",
      ads: "الترويج",
      import: "الاستيراد",
      wallet: "المحفظة",
      subscription: "الاشتراك",
    },
    common: {
      signOut: "تسجيل الخروج",
      marketSuffix: "ماركت",
      seller: "بائع",
      dealer: "تاجر",
      switchToArabic: "العربية",
      switchToEnglish: "English",
    },
  },
};
