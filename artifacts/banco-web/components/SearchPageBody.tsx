import {
  buildSearchParams,
  parseSearchCriteriaFromUrl,
} from "@workspace/search-contract";
import { parseSearchViewFromUrl } from "../lib/map-contract";
import type { FeedItem } from "@workspace/api-client-react";
import { SearchLiveResults } from "./SearchLiveResults";
import { SearchControls } from "./SearchControls";
import { SearchFacetsPanel } from "./SearchFacetsPanel";
import { SearchMapPanel } from "./SearchMapPanel";
import { SearchQueryProvider } from "./SearchQueryProvider";
import { SearchViewToggle } from "./SearchViewToggle";
import { searchConfig, clampSearchLimit } from "../lib/search-config";
import { buildSearchHeading } from "../lib/search-labels";
import type { SiteLocale } from "../lib/hub-config";

const pageStyle: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "2rem 1.25rem",
};

const mutedStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--banco-muted)",
  lineHeight: 1.7,
};

const boxStyle: React.CSSProperties = {
  border: "1px solid var(--banco-border)",
  borderRadius: "var(--banco-radius)",
  background: "var(--banco-card)",
  padding: "1rem",
  marginTop: "1rem",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.75rem",
};

const pillStyle: React.CSSProperties = {
  border: "1px solid var(--banco-border)",
  borderRadius: 999,
  padding: "0.35rem 0.75rem",
  fontSize: "0.8rem",
  color: "var(--banco-muted)",
  display: "inline-block",
  textDecoration: "none",
};

const mockResults: FeedItem[] = [
  {
    id: "preview-1",
    media_preview: "",
    price_display: "1,250,000 EGP",
    title: "Toyota Corolla 2021",
    location: "New Cairo",
    trust_signal: "Verified",
    has_video: false,
    is_sponsored: false,
    category: "car",
  },
  {
    id: "preview-2",
    media_preview: "",
    price_display: "3,400,000 EGP",
    title: "Apartment 180m",
    location: "Sheikh Zayed",
    trust_signal: "Trusted Seller",
    has_video: false,
    is_sponsored: false,
    category: "real_estate",
  },
];

const COPY = {
  ar: {
    disabledTitle: "البحث",
    disabledBody: "البحث معطّل مؤقتاً. استخدم مراكز التصفح أدناه.",
    hubsTitle: "مراكز التصفح",
    intro: "ابحث في السيارات والعقارات والصناعة — نفس عقد البحث المشترك مع تطبيق الجوال.",
    hubs: [
      { href: "/cars", label: "سيارات" },
      { href: "/real-estate", label: "عقارات" },
      { href: "/industrial", label: "صناعي" },
    ],
  },
  en: {
    disabledTitle: "Search",
    disabledBody: "Search is temporarily disabled. Use the browse hubs below.",
    hubsTitle: "Browse hubs",
    intro: "Search cars, real estate, and industrial listings — same contract as the mobile app.",
    hubs: [
      { href: "/en/cars", label: "Cars" },
      { href: "/en/real-estate", label: "Real Estate" },
      { href: "/en/industrial", label: "Industrial" },
    ],
  },
} as const;

type SearchPageBodyProps = {
  searchParams: Record<string, string | string[] | undefined>;
  locale?: SiteLocale;
};

export function SearchPageBody({
  searchParams,
  locale = "ar",
}: SearchPageBodyProps) {
  const copy = COPY[locale];
  const criteria = parseSearchCriteriaFromUrl(searchParams);
  const limit = clampSearchLimit(Number(searchParams.limit ?? searchConfig.limits.default));
  const apiParams = buildSearchParams(
    criteria,
    typeof searchParams.cursor === "string" ? searchParams.cursor : undefined,
    limit,
  );
  const liveSearchEnabled = searchConfig.liveSearchEnabled;
  const mapSearchEnabled = searchConfig.map.enabled;
  const searchEnabled = searchConfig.searchEnabled;
  const view = parseSearchViewFromUrl(searchParams);
  const showMapView = searchEnabled && mapSearchEnabled && view === "map";
  const pageHeading = buildSearchHeading(criteria, locale);

  if (!searchEnabled) {
    return (
      <main style={pageStyle}>
        <h1 style={{ marginTop: 0 }}>{copy.disabledTitle}</h1>
        <p style={mutedStyle}>{copy.disabledBody}</p>
        <section style={boxStyle}>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem" }}>{copy.hubsTitle}</h2>
          <div style={gridStyle}>
            {copy.hubs.map((hub) => (
              <a key={hub.href} href={hub.href} style={pillStyle}>
                {hub.label}
              </a>
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <h1 style={{ marginTop: 0 }}>{pageHeading}</h1>
      <p style={mutedStyle}>{copy.intro}</p>

      <SearchQueryProvider>
        <SearchControls liveEnabled={liveSearchEnabled} />
        {mapSearchEnabled ? <SearchViewToggle view={view} /> : null}

        {showMapView ? (
          <SearchMapPanel
            mapEnabled={mapSearchEnabled}
            liveEnabled={liveSearchEnabled}
            criteria={criteria}
          />
        ) : (
          <>
            <SearchLiveResults
              enabled={liveSearchEnabled}
              criteria={apiParams}
              fallbackItems={mockResults}
            />
            <SearchFacetsPanel
              enabled={liveSearchEnabled}
              category={apiParams.category}
            />
          </>
        )}
      </SearchQueryProvider>
    </main>
  );
}
