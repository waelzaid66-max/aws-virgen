import logoUrl from "@/assets/banco-logo.png";

/**
 * BANCO — the official entry page. Replaces the old placeholder (logo + a
 * "دخول" button that pointed at the retired Replit mobile link) with a real
 * directory of every surface and its main destinations: the mobile app (store
 * links), Banco Market, and the Admin control panel.
 *
 * All bases come from Vite env so the SAME build works in every environment:
 *   VITE_MARKET_URL · VITE_ADMIN_URL · VITE_APP_ANDROID_URL · VITE_APP_IOS_URL
 * A surface whose URL isn't configured yet renders as "قريباً / soon" instead
 * of a dead link — no stale hardcoded destinations, ever.
 */

const ENV = import.meta.env as Record<string, string | undefined>;
const MARKET_URL = ENV.VITE_MARKET_URL ?? "";
const ADMIN_URL = ENV.VITE_ADMIN_URL ?? "";
const ANDROID_URL = ENV.VITE_APP_ANDROID_URL ?? "";
const IOS_URL = ENV.VITE_APP_IOS_URL ?? "";

type Dest = { ar: string; en: string; path: string };

const MARKET_PAGES: Dest[] = [
  { ar: "الرئيسية", en: "Home", path: "/" },
  { ar: "الإعلانات", en: "Listings", path: "/listings" },
  { ar: "طلبات التسعير", en: "RFQs", path: "/rfqs" },
  { ar: "التوريد العالمي", en: "Global Supply", path: "/global-supply" },
  { ar: "الاستثمارات", en: "Investments", path: "/investments" },
  { ar: "التحليلات", en: "Analytics", path: "/analytics" },
  { ar: "الخصوصية", en: "Privacy", path: "/privacy" },
  { ar: "الشروط", en: "Terms", path: "/terms" },
];

const ADMIN_PAGES: Dest[] = [
  { ar: "نظرة عامة", en: "Overview", path: "/overview" },
  { ar: "المستخدمون", en: "Users", path: "/users" },
  { ar: "الإعلانات", en: "Listings", path: "/listings" },
  { ar: "الإشراف", en: "Moderation", path: "/moderation" },
  { ar: "الإيرادات", en: "Revenue", path: "/revenue" },
  { ar: "المراقبة", en: "Monitoring", path: "/monitoring" },
];

const APP_SECTIONS: { ar: string; en: string }[] = [
  { ar: "السيارات", en: "Cars" },
  { ar: "العقارات — بيع وإيجار وحجز يومي", en: "Real Estate — sale, rent & daily booking" },
  { ar: "الصناعة والتوريد", en: "Industry & Supply" },
  { ar: "سوق الأعمال B2B", en: "B2B Market" },
  { ar: "الرسائل", en: "Messenger" },
  { ar: "المساعد الذكي", en: "AI Assistant" },
];

function LinkOrSoon({ url, label }: { url: string; label: string }) {
  if (!url) {
    return <span style={S.soon}>{label} — قريباً</span>;
  }
  return (
    <a href={url} target="_blank" rel="noreferrer" style={S.cta}>
      {label}
    </a>
  );
}

function App() {
  return (
    <div style={S.page} dir="rtl">
      <header style={S.hero}>
        <img src={logoUrl} alt="BANCO" style={S.logo} />
        <h1 style={S.title}>بانكو — سوق واحد لكل شيء</h1>
        <p style={S.tagline}>
          سيارات · عقارات وحجز يومي · صناعة وتوريد · أعمال B2B — على الموبايل
          والويب
        </p>
      </header>

      <main style={S.grid}>
        {/* التطبيق */}
        <section style={{ ...S.card, borderTopColor: "#E8002D" }}>
          <h2 style={S.cardTitle}>📱 تطبيق بانكو</h2>
          <p style={S.cardBody}>التجربة الكاملة — كل الأقسام والخدمات:</p>
          <ul style={S.list}>
            {APP_SECTIONS.map((s) => (
              <li key={s.en} style={S.li}>
                {s.ar}
              </li>
            ))}
          </ul>
          <div style={S.ctaRow}>
            <LinkOrSoon url={ANDROID_URL} label="Google Play" />
            <LinkOrSoon url={IOS_URL} label="App Store" />
          </div>
        </section>

        {/* بانكو ماركت */}
        <section style={{ ...S.card, borderTopColor: "#1FA97D" }}>
          <h2 style={S.cardTitle}>🛒 بانكو ماركت</h2>
          <p style={S.cardBody}>منصة الويب للتجار والشركات — الصفحات الرئيسية:</p>
          <ul style={S.list}>
            {MARKET_PAGES.map((p) => (
              <li key={p.path} style={S.li}>
                {MARKET_URL ? (
                  <a href={MARKET_URL + p.path} style={S.pageLink}>
                    {p.ar} <span style={S.pathMono}>{p.path}</span>
                  </a>
                ) : (
                  <>
                    {p.ar} <span style={S.pathMono}>{p.path}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div style={S.ctaRow}>
            <LinkOrSoon url={MARKET_URL} label="افتح بانكو ماركت" />
          </div>
        </section>

        {/* لوحة التحكم */}
        <section style={{ ...S.card, borderTopColor: "#3B82F6" }}>
          <h2 style={S.cardTitle}>🛠️ لوحة التحكم</h2>
          <p style={S.cardBody}>لإدارة المنصة (للفريق فقط) — الأقسام الرئيسية:</p>
          <ul style={S.list}>
            {ADMIN_PAGES.map((p) => (
              <li key={p.path} style={S.li}>
                {ADMIN_URL ? (
                  <a href={ADMIN_URL + p.path} style={S.pageLink}>
                    {p.ar} <span style={S.pathMono}>{p.path}</span>
                  </a>
                ) : (
                  <>
                    {p.ar} <span style={S.pathMono}>{p.path}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
          <div style={S.ctaRow}>
            <LinkOrSoon url={ADMIN_URL} label="افتح لوحة التحكم" />
          </div>
        </section>
      </main>

      <footer style={S.footer}>
        © {new Date().getFullYear()} BANCO — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f5f5f5",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    padding: "clamp(16px, 4vw, 48px)",
    display: "flex",
    flexDirection: "column",
    gap: 36,
  },
  hero: { textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  logo: { width: "min(52vw, 220px)", height: "auto" },
  title: { fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 800, margin: 0 },
  tagline: { color: "#b8b8b8", fontSize: "clamp(14px, 2vw, 17px)", margin: 0, lineHeight: 1.8 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 18,
    maxWidth: 1100,
    width: "100%",
    margin: "0 auto",
  },
  card: {
    background: "#141414",
    border: "1px solid #262626",
    borderTopWidth: 4,
    borderRadius: 16,
    padding: "22px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  cardTitle: { fontSize: 19, fontWeight: 800, margin: 0 },
  cardBody: { color: "#a8a8a8", fontSize: 14, margin: 0 },
  list: { margin: 0, paddingInlineStart: 18, display: "flex", flexDirection: "column", gap: 6 },
  li: { fontSize: 14, lineHeight: 1.7 },
  pageLink: { color: "#f5f5f5", textDecoration: "none" },
  pathMono: { color: "#7a7a7a", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, marginInlineStart: 6 },
  ctaRow: { display: "flex", gap: 10, marginTop: "auto", paddingTop: 12, flexWrap: "wrap" },
  cta: {
    backgroundColor: "#E8002D",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14.5,
    padding: "10px 22px",
    borderRadius: 999,
    textDecoration: "none",
  },
  soon: {
    border: "1px solid #333",
    color: "#8a8a8a",
    fontWeight: 600,
    fontSize: 14,
    padding: "10px 22px",
    borderRadius: 999,
  },
  footer: { textAlign: "center", color: "#6a6a6a", fontSize: 12, marginTop: "auto" },
};

export default App;
