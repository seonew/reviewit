"use client";

import { useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import useGeolocation from "@/hooks/useGeolocation";
import { Coordinates } from "@/utils/types";
import { INITIAL_CENTER } from "@/hooks/useMap";
import LocalList from "./components/LocalList";
import MapSection from "./components/MapSection";
import SearchSection from "./components/SearchSection";
import Markers from "./components/Markers";

const List = () => {
  const naverLocation = useGeolocation();
  const { initializeMap, fetchLocalPlaces, localPlaces, currentLocation } =
    useStore();

  const loaded = naverLocation.loaded;
  const coordinates = naverLocation.coordinates;

  const currentCenter: Coordinates =
    loaded && coordinates
      ? [coordinates?.lat, coordinates?.lng]
      : INITIAL_CENTER;

  const handleSubmit = (keyword: string) => {
    const location = {
      lat: currentLocation![0],
      lng: currentLocation![1],
    };
    fetchLocalPlaces(`${keyword}`, location);
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  return (
    <div className="contents-container">
      {!loaded ? (
        <div>loading</div>
      ) : (
        <>
          <div className="relative pt-8">
            <SearchSection onClick={handleSubmit} />
            <MapSection currentCenter={currentCenter} />
            {localPlaces && <Markers items={localPlaces} />}
          </div>
          {localPlaces && <LocalList items={localPlaces} />}
        </>
      )}
    </div>
  );
};

export default List;
