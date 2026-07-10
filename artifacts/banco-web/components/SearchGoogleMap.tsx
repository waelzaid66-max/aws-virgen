"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  Marker,
  type MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import type { MapCluster } from "@workspace/api-client-react";
import {
  boundsLiteralToViewport,
  viewportCenter,
  type MapViewport,
} from "../lib/map-contract";
import { searchConfig } from "../lib/search-config";
import { formatMapTotalInViewport, searchUiCopy } from "../lib/search-ui-copy";
import { useSearchLocale } from "../lib/use-search-locale";

type SearchGoogleMapProps = {
  clusters: MapCluster[];
  viewport: MapViewport;
  totalListings: number;
  onViewportChange: (viewport: MapViewport) => void;
};

function ClusterMarkers({ clusters }: { clusters: MapCluster[] }) {
  return (
    <>
      {clusters.map((cluster, index) => {
        const label =
          cluster.count === 1
            ? cluster.price_display?.trim() ||
              (cluster.is_bookable ? "Bookable" : "1")
            : String(cluster.count);
        return (
          <Marker
            key={`${cluster.lat}-${cluster.lng}-${index}`}
            position={{ lat: cluster.lat, lng: cluster.lng }}
            label={{
              text: label,
              color: "#111111",
              fontWeight: "700",
            }}
          />
        );
      })}
    </>
  );
}

export function SearchGoogleMap({
  clusters,
  viewport,
  totalListings,
  onViewportChange,
}: SearchGoogleMapProps) {
  const locale = useSearchLocale();
  const copy = searchUiCopy(locale);
  const center = viewportCenter(viewport);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onViewportChangeRef = useRef(onViewportChange);
  onViewportChangeRef.current = onViewportChange;

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  const handleCameraChanged = useCallback((event: MapCameraChangedEvent) => {
    const { bounds, zoom } = event.detail;
    if (!bounds) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      onViewportChangeRef.current(boundsLiteralToViewport(bounds, zoom));
    }, searchConfig.map.debounceMs);
  }, []);

  return (
    <APIProvider apiKey={searchConfig.map.googleMapsApiKey}>
      <div
        style={{
          position: "relative",
          marginTop: "0.75rem",
          minHeight: 320,
          borderRadius: "var(--banco-radius)",
          border: "1px solid var(--banco-border)",
          overflow: "hidden",
        }}
        aria-label={copy.mapAria}
      >
        <Map
          defaultCenter={center}
          defaultZoom={viewport.zoom}
          gestureHandling="greedy"
          reuseMaps
          style={{ width: "100%", height: 320 }}
          onCameraChanged={handleCameraChanged}
        >
          <ClusterMarkers clusters={clusters} />
        </Map>
        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            color: "#ffffff",
            background: "rgba(0,0,0,0.55)",
            padding: "0.25rem 0.5rem",
            borderRadius: 8,
            fontSize: "0.8rem",
            pointerEvents: "none",
          }}
        >
          {formatMapTotalInViewport(locale, totalListings)}
        </div>
      </div>
    </APIProvider>
  );
}
