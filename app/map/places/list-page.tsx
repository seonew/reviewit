"use client";

import { useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import useGeolocation from "@/hooks/useGeolocation";
import { Coordinates } from "@/utils/types";
import { INITIAL_CENTER } from "@/hooks/useMap";
import Loading from "../components/Loading";
import SearchSection from "../components/SearchSection";
import MapSection from "../components/MapSection";
import Markers from "../components/Markers";
import PlaceReviewList from "../components/PlaceReviewList";

const List = () => {
  const naverLocation = useGeolocation();
  const {
    initializeMap,
    fetchPlaceReview,
    fetchPlaceReviewByName,
    placeReviews,
  } = useStore();

  const loaded = naverLocation.loaded;
  const coordinates = naverLocation.coordinates;

  const currentCenter: Coordinates =
    loaded && coordinates
      ? [coordinates?.lat, coordinates?.lng]
      : INITIAL_CENTER;

  const { data, locals } = placeReviews;

  const handleSubmit = (keyword: string) => {
    fetchPlaceReviewByName(keyword);
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    fetchPlaceReview();
  }, []);

  return (
    <div className="contents-container">
      {!loaded ? (
        <Loading />
      ) : (
        <>
          <div className="relative pt-8">
            <SearchSection onClick={handleSubmit} />
            <MapSection currentCenter={currentCenter} />
            {locals && <Markers items={locals} />}
          </div>
          <PlaceReviewList data={data} />
        </>
      )}
    </div>
  );
};

export default List;
