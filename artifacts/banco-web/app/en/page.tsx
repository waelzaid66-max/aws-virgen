import { JsonLd } from "../../components/JsonLd";
import { HomeFeedTeaser } from "../../components/HomeFeedTeaser";
import { HomeTrendingStrip } from "../../components/HomeTrendingStrip";
import { bancoBrand } from "@workspace/design-tokens";
import { collectionPageJsonLd } from "../../lib/structured-data";
import { pageMetadata } from "../../lib/page-metadata";

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
  title: "BANCO — Cars, Real Estate & Industrial",
  description: "Browse cars, real estate, and industrial listings in Egypt on BANCO",
  path: "/en",
  locale: "en",
});

export default function EnglishHomePage() {
  return (
    <main style={sectionStyle}>
      <JsonLd
        data={collectionPageJsonLd({
          name: "BANCO",
          description: "Browse cars, real estate, and industrial listings",
          path: "/en",
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
        Browse the market in one place
      </h1>
      <p style={{ margin: 0, color: "var(--banco-muted)", lineHeight: 1.7, maxWidth: 560 }}>
        The consumer web companion — unified search with the mobile app via the shared search contract.
      </p>
      <nav style={gridStyle} aria-label="Browse hubs">
        <a href="/en/search" style={hubCardStyle}>
          <strong>Search</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
            Filters, map, and live results
          </p>
        </a>
        <a href="/en/cars" style={hubCardStyle}>
          <strong>Cars</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
            Sale and financing
          </p>
        </a>
        <a href="/en/real-estate" style={hubCardStyle}>
          <strong>Real Estate</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
            Sale and rent
          </p>
        </a>
        <a href="/en/industrial" style={hubCardStyle}>
          <strong>Industrial</strong>
          <p style={{ margin: "0.35rem 0 0", color: "var(--banco-muted)", fontSize: "0.9rem" }}>
            Facilities and materials
          </p>
        </a>
      </nav>
      <HomeTrendingStrip locale="en" />
      <HomeFeedTeaser locale="en" />
    </main>
  );
}
