"use client";

import Link from "next/link";
import {
  useGetFeed,
  type GetFeedCategory,
} from "@workspace/api-client-react";
import { ListingCard } from "./ListingCard";

const sectionStyle: React.CSSProperties = {
  marginTop: "1.25rem",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: "0.75rem",
  flexWrap: "wrap",
};

const listStyle: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: "0.75rem 0 0",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "0.75rem",
};

type HubFeedTeaserProps = {
  title: string;
  category: GetFeedCategory;
  searchHref: string;
  locale?: "ar" | "en";
};

const VIEW_ALL = { ar: "عرض الكل", en: "View all" } as const;
const LOADING = { ar: "جاري التحميل…", en: "Loading…" } as const;

export function HubFeedTeaser({
  title,
  category,
  searchHref,
  locale = "ar",
}: HubFeedTeaserProps) {
  const query = useGetFeed({ limit: 6, category });
  const items = query.data?.data ?? [];

  if (query.isLoading) {
    return (
      <section style={sectionStyle}>
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{title}</h2>
        <p style={{ color: "var(--banco-muted)", marginTop: "0.5rem" }}>{LOADING[locale]}</p>
      </section>
    );
  }

  if (query.isError || items.length === 0) {
    return null;
  }

  return (
    <section style={sectionStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{title}</h2>
        <Link href={searchHref} style={{ color: "var(--banco-primary)", fontWeight: 600 }}>
          {VIEW_ALL[locale]}
        </Link>
      </div>
      <ul style={listStyle}>
        {items.map((item) => (
          <li key={item.id}>
            <ListingCard item={item} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
