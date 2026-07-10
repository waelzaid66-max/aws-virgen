"use client";

import Link from "next/link";
import type { FeedItem, ListingDetail } from "@workspace/api-client-react";
import { formatApiCategoryLabel } from "../lib/category-labels";
import { formatListingStatus } from "../lib/listing-labels";
import { LISTING_HUB_LABELS, listingUiCopy } from "../lib/listing-ui-copy";
import { searchUiCopy } from "../lib/search-ui-copy";
import { useSearchLocale } from "../lib/use-search-locale";
import { ListingShareActions } from "./ListingShareActions";
import { SearchResultsSection } from "./SearchResultsSection";

const wrapStyle: React.CSSProperties = {
  border: "1px solid var(--banco-border)",
  borderRadius: "var(--banco-radius)",
  background: "var(--banco-card)",
  padding: "1rem",
  marginTop: "1rem",
};

const mutedStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--banco-muted)",
  lineHeight: 1.7,
};

type ListingDetailViewProps = {
  listing: ListingDetail;
  similarItems?: FeedItem[];
};

export function ListingDetailView({
  listing,
  similarItems = [],
}: ListingDetailViewProps) {
  const locale = useSearchLocale();
  const copy = listingUiCopy(locale);
  const searchCopy = searchUiCopy(locale);
  const hub = LISTING_HUB_LABELS[locale][listing.category];
  const hero = listing.media?.[0]?.url ?? null;
  const homeHref = locale === "en" ? "/en" : "/";

  return (
    <>
      <nav
        aria-label={copy.breadcrumbAria}
        style={{
          marginBottom: "0.75rem",
          fontSize: "0.85rem",
          color: "var(--banco-muted)",
        }}
      >
        <Link href={homeHref} style={{ color: "var(--banco-primary)", textDecoration: "none" }}>
          {copy.home}
        </Link>
        {hub ? (
          <>
            {" / "}
            <Link href={hub.href} style={{ color: "var(--banco-primary)", textDecoration: "none" }}>
              {hub.label}
            </Link>
          </>
        ) : null}
        {" / "}
        <span>{listing.title}</span>
      </nav>
      <article style={wrapStyle}>
        {hero ? (
          <img
            src={hero}
            alt={listing.title}
            style={{
              width: "100%",
              maxHeight: 420,
              objectFit: "cover",
              borderRadius: 12,
              marginBottom: "1rem",
            }}
          />
        ) : null}
        <h1 style={{ marginTop: 0 }}>{listing.title}</h1>
        <p style={{ ...mutedStyle, fontSize: "1.1rem" }}>
          {listing.price_display} · {listing.location}
        </p>
        {listing.description ? (
          <p style={{ ...mutedStyle, marginTop: "0.75rem" }}>{listing.description}</p>
        ) : null}
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          <div>
            <dt style={mutedStyle}>{copy.category}</dt>
            <dd style={{ margin: "0.25rem 0 0" }}>
              {formatApiCategoryLabel(listing.category, locale)}
            </dd>
          </div>
          <div>
            <dt style={mutedStyle}>{copy.status}</dt>
            <dd style={{ margin: "0.25rem 0 0" }}>
              {formatListingStatus(listing.status, locale)}
            </dd>
          </div>
          <div>
            <dt style={mutedStyle}>{copy.seller}</dt>
            <dd style={{ margin: "0.25rem 0 0" }}>{listing.seller.name}</dd>
          </div>
        </dl>
        <ListingShareActions listingId={listing.id} title={listing.title} />
      </article>
      {similarItems.length > 0 ? (
        <section style={{ marginTop: "1.25rem" }}>
          <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>
            {searchCopy.similarListingsTitle}
          </h2>
          <SearchResultsSection items={similarItems} hideHeader />
        </section>
      ) : null}
    </>
  );
}
