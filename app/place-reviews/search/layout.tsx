"use client";

import { useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import { INITIAL_CENTER } from "@/hooks/useMap";
import { Coordinates } from "@/types";
import useGeolocation from "@/hooks/useGeolocation";
import LoadingMap from "../components/LoadingMap";
import MapSection from "../components/MapSection";
import ResetButton from "../components/ResetButton";
import SearchSection from "../components/SearchSection";

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const naverLocation = useGeolocation();
  const { initializeMap } = useStore();

  const loaded = naverLocation.loaded;
  const coordinates = naverLocation.coordinates;

  const currentCenter: Coordinates =
    loaded && coordinates
      ? [coordinates?.lat, coordinates?.lng]
      : INITIAL_CENTER;

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  return (
    <div className="contents-container">
      {!loaded ? (
        <LoadingMap />
      ) : (
        <>
          <div className="relative pt-8">
            <SearchSection />
            <MapSection currentCenter={currentCenter} />
          </div>
          <div>{children}</div>
        </>
      )}
    </div>
  );
}
