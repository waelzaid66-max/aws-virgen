import { JsonLd } from "../components/JsonLd";
import { HomeFeedTeaser } from "../components/HomeFeedTeaser";
import { HomeTrendingStrip } from "../components/HomeTrendingStrip";
import { bancoBrand } from "@workspace/design-tokens";
import { collectionPageJsonLd } from "../lib/structured-data";
import { pageMetadata } from "../lib/page-metadata";

const sectionStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "2rem 1.25rem",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "0.75rem",
  marginTop: "1.25rem",
};

const hubCardStyle: React.CSSProperties = {
  border: "1px solid var(--banco-border)",
  borderRadius: "var(--banco-radius)",
  background: "var(--banco-card)",
  padding: "1rem",
  textDecoration: "none",
  color: "var(--banco-fg)",
  display: "block",
};

export const metadata = pageMetadata({
  title: "BANCO — سيارات وعقارات وصناعي",
  description: "منصة BANCO للبحث عن سيارات وعقارات ومنشآت صناعية في مصر",
  path: "/",
});

export default function HomePage() {
  return (
    <main style={sectionStyle}>
      <JsonLd
        data={collectionPageJsonLd({
          name: "BANCO",
          description: "تصفح سيارات وعقارات ومنشآت صناعية",
          path: "/",
        })}
      />
      <p
        style={{
          margin: "0 0 0.5rem",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: bancoBrand.red,
        }}
      >
        BANCO
      </p>
      <h1 style={{ margin: "0 0 0.75rem", fontSize: "1.75rem" }}>
        تصفّح السوق في مكان واحد
      </h1>
      <p style={{ margin: 0, color: "var(--banco-muted)", lineHeight: 1.7, maxWidth: 560 }}>
        موقع المستهلك التكميلي — بحث موحّد مع تطبيق الجوال عبر عقد البحث المشترك.
      </p>
      <nav style={gridStyle} aria-label="مراكز التصفح">
        <a href="/search" style={hubCardStyle}>
          <strong>بحث عام</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
            فلاتر، خريطة، ونتائج حية
          </p>
        </a>
        <a href="/cars" style={hubCardStyle}>
          <strong>سيارات</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
            بيع وتقسيط
          </p>
        </a>
        <a href="/real-estate" style={hubCardStyle}>
          <strong>عقارات</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
            بيع وإيجار
          </p>
        </a>
        <a href="/industrial" style={hubCardStyle}>
          <strong>صناعي</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
            منشآت ومواد
          </p>
        </a>
      </nav>
      <HomeTrendingStrip />
      <HomeFeedTeaser />
    </main>
  );
}
