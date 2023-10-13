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
import Loading from "./components/Loading";
import CommentModal from "./components/CommentModal";
import { handleClickSignIn } from "@/utils/common";

const List = () => {
  const naverLocation = useGeolocation();
  const {
    initializeMap,
    fetchLocalPlaces,
    insertPlaceReview,
    localPlaces,
    currentLocation,
    user,
  } = useStore();

  const loaded = naverLocation.loaded;
  const coordinates = naverLocation.coordinates;

  const currentCenter: Coordinates =
    loaded && coordinates
      ? [coordinates?.lat, coordinates?.lng]
      : INITIAL_CENTER;

  const handleSubmit = (keyword: string) => {
    const lat = currentLocation ? currentLocation[0] : INITIAL_CENTER[0];
    const lng = currentLocation ? currentLocation[1] : INITIAL_CENTER[1];
    const location = { lat, lng };

    fetchLocalPlaces(`${keyword}`, location);
  };

  const handleSubmitReview = (review: string, like: boolean) => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }
    insertPlaceReview(review, like);
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  return (
    <div className="contents-container">
      {!loaded ? (
        <Loading />
      ) : (
        <>
          <div className="relative pt-8">
            <SearchSection onClick={handleSubmit} />
            <MapSection currentCenter={currentCenter} />
            {localPlaces && <Markers items={localPlaces} />}
          </div>
          {localPlaces && <LocalList items={localPlaces} />}
          <CommentModal onSubmit={handleSubmitReview} />
        </>
      )}
    </div>
  );
};

export default List;
