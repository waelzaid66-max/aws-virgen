/**
 * Admin Control Center i18n — mirrors the mobile app's proven pattern:
 * one `en` source of truth and an `ar` object typed as `typeof en`, so a
 * missing/extra Arabic key FAILS TYPECHECK (parity is enforced at compile
 * time, never discovered at runtime).
 *
 * Keys are added page-by-page; the shell (nav/layout) is the foundation.
 */

const en = {
  layout: {
    controlCenter: "Control Center",
    bancoStaff: "BANCO Staff",
    language: "العربية",
  },
  nav: {
    overview: "Overview",
    users: "Users",
    listings: "Listings",
    moderation: "Moderation Queue",
    reports: "Reports",
    support: "Support Tickets",
    leads: "Leads",
    financing: "Financing CRM",
    ads: "Ad Campaigns",
    revenue: "Revenue",
    analytics: "Analytics",
    fraud: "Fraud Signals",
    monitoring: "Monitoring",
    alerts: "Alerts",
    plans: "Plans & Pricing",
    promo: "Free Ad Credit",
    settings: "Payment Settings",
  },
  roles: {
    owner: "Owner",
    admin: "Admin",
    moderator: "Moderator",
    support: "Support",
    user: "Staff",
  },
  common: {
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    total: "Total",
    active: "Active",
    inactive: "Inactive",
    yes: "Yes",
    no: "No",
  },
};

const ar: typeof en = {
  layout: {
    controlCenter: "مركز التحكم",
    bancoStaff: "فريق بانكو",
    language: "English",
  },
  nav: {
    overview: "نظرة عامة",
    users: "المستخدمون",
    listings: "الإعلانات",
    moderation: "طابور المراجعة",
    reports: "البلاغات",
    support: "تذاكر الدعم",
    leads: "العملاء المحتملون",
    financing: "تمويل CRM",
    ads: "الحملات الإعلانية",
    revenue: "الإيرادات",
    analytics: "التحليلات",
    fraud: "إشارات الاحتيال",
    monitoring: "المراقبة",
    alerts: "التنبيهات",
    plans: "الباقات والأسعار",
    promo: "رصيد إعلاني مجاني",
    settings: "إعدادات الدفع",
  },
  roles: {
    owner: "المالك",
    admin: "مدير",
    moderator: "مشرف",
    support: "دعم",
    user: "فريق",
  },
  common: {
    loading: "جارٍ التحميل…",
    save: "حفظ",
    cancel: "إلغاء",
    create: "إنشاء",
    edit: "تعديل",
    delete: "حذف",
    search: "بحث",
    total: "الإجمالي",
    active: "نشط",
    inactive: "غير نشط",
    yes: "نعم",
    no: "لا",
  },
};

export const translations = { en, ar } as const;
export type Lang = keyof typeof translations;
export type TranslationTree = typeof en;
