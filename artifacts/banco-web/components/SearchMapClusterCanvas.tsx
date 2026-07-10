"use client";

import type { MapCluster } from "@workspace/api-client-react";
import { clusterToViewportPercent, type MapViewport } from "../lib/map-contract";
import {
  formatMapClusterLabel,
  formatMapTotalInViewport,
  searchUiCopy,
} from "../lib/search-ui-copy";
import { useSearchLocale } from "../lib/use-search-locale";

type SearchMapClusterCanvasProps = {
  clusters: MapCluster[];
  viewport: MapViewport;
  totalListings: number;
};

const canvasStyle: React.CSSProperties = {
  position: "relative",
  marginTop: "0.75rem",
  minHeight: 280,
  borderRadius: "var(--banco-radius)",
  border: "1px solid var(--banco-border)",
  background:
    "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03), transparent 40%), #0b0b0b",
  overflow: "hidden",
};

const bubbleStyle: React.CSSProperties = {
  position: "absolute",
  transform: "translate(-50%, -50%)",
  borderRadius: 999,
  border: "1px solid var(--banco-border)",
  background: "rgba(255,255,255,0.08)",
  color: "var(--banco-fg)",
  fontSize: "0.78rem",
  fontWeight: 700,
  padding: "0.35rem 0.55rem",
  whiteSpace: "nowrap",
};

export function SearchMapClusterCanvas({
  clusters,
  viewport,
  totalListings,
}: SearchMapClusterCanvasProps) {
  const locale = useSearchLocale();
  const copy = searchUiCopy(locale);

  return (
    <div style={canvasStyle} aria-label={copy.mapPreviewAria}>
      <div
        style={{
          position: "absolute",
          inset: 12,
          border: "1px dashed rgba(255,255,255,0.12)",
          borderRadius: 12,
          pointerEvents: "none",
        }}
      />
      {clusters.map((cluster, index) => {
        const position = clusterToViewportPercent(cluster, viewport);
        const label = formatMapClusterLabel(
          locale,
          cluster.count,
          Boolean(cluster.listing_id),
        );
        return (
          <div
            key={`${cluster.lat}-${cluster.lng}-${index}`}
            style={{
              ...bubbleStyle,
              left: `${position.left}%`,
              top: `${position.top}%`,
              background:
                cluster.count > 1
                  ? "rgba(123, 216, 143, 0.18)"
                  : "rgba(255, 209, 102, 0.18)",
            }}
            title={`${label} — ${cluster.lat.toFixed(4)}, ${cluster.lng.toFixed(4)}`}
          >
            {label}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          color: "var(--banco-muted)",
          fontSize: "0.8rem",
        }}
      >
        {formatMapTotalInViewport(locale, totalListings)}
      </div>
    </div>
  );
}
