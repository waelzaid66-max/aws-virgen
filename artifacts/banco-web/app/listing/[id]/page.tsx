import { notFound } from "next/navigation";
import { getListing, getSimilarListings } from "@workspace/api-client-react";
import { JsonLd } from "../../../components/JsonLd";
import { ListingDetailView } from "../../../components/ListingDetailView";
import { ensureApiClientConfigured } from "../../../lib/api-client-config";
import { listingProductJsonLd, breadcrumbJsonLd } from "../../../lib/structured-data";
import { listingPageMetadata } from "../../../lib/page-metadata";

type ListingPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ListingPageProps) {
  const { id } = await params;
  ensureApiClientConfigured();
  try {
    const res = await getListing(id);
    const listing = res.data;
    if (!listing) return { title: "إعلان غير موجود" };
    const hero = listing.media?.[0]?.url;
    const description =
      listing.description ?? `${listing.price_display} · ${listing.location}`;
    return listingPageMetadata({
      title: listing.title,
      description,
      listingId: listing.id,
      imageUrl: hero,
    });
  } catch {
    return { title: "إعلان" };
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { id } = await params;
  ensureApiClientConfigured();

  let listing;
  try {
    const res = await getListing(id);
    listing = res.data;
  } catch {
    notFound();
  }

  if (!listing) notFound();

  const breadcrumbItems = [
    { name: "الرئيسية", path: "/" },
    { name: listing.title, path: `/listing/${listing.id}` },
  ];

  let similarItems: Awaited<ReturnType<typeof getSimilarListings>>["data"] = [];
  try {
    const similarRes = await getSimilarListings(id);
    similarItems = similarRes.data ?? [];
  } catch {
    similarItems = [];
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.25rem" }}>
      <JsonLd data={listingProductJsonLd(listing)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <ListingDetailView listing={listing} similarItems={similarItems} />
    </main>
  );
}
