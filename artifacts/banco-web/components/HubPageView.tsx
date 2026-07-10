import { JsonLd } from "./JsonLd";
import { HubFeedTeaser } from "./HubFeedTeaser";
import { HubQuickLinks } from "./HubQuickLinks";
import {
  HUB_DEFINITIONS,
  hubCopy,
  homePathForLocale,
  type HubKey,
  type SiteLocale,
} from "../lib/hub-config";
import { breadcrumbJsonLd, collectionPageJsonLd } from "../lib/structured-data";

const sectionStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  padding: "2rem 1.25rem",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--banco-border)",
  borderRadius: "var(--banco-radius)",
  background: "var(--banco-card)",
  padding: "1rem",
};

type HubPageViewProps = {
  hub: HubKey;
  locale: SiteLocale;
};

export function HubPageView({ hub, locale }: HubPageViewProps) {
  const copy = hubCopy(hub, locale);
  const homeLabel = locale === "en" ? "Home" : "الرئيسية";
  const homePath = homePathForLocale(locale);

  return (
    <main style={sectionStyle}>
      <JsonLd
        data={collectionPageJsonLd({
          name: copy.jsonLdName,
          description: copy.jsonLdDescription,
          path: copy.path,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: homeLabel, path: homePath },
          { name: copy.breadcrumbLabel, path: copy.path },
        ])}
      />
      <h1 style={{ marginTop: 0 }}>{copy.h1}</h1>
      <p style={{ color: "var(--banco-muted)", lineHeight: 1.7 }}>{copy.intro}</p>
      <section style={cardStyle}>
        <strong>{copy.cardTitle}</strong>
        <HubQuickLinks links={copy.links} />
      </section>
      <HubFeedTeaser
        title={copy.feedTitle}
        category={HUB_DEFINITIONS[hub].category}
        searchHref={copy.searchHref}
        locale={locale}
      />
    </main>
  );
}
