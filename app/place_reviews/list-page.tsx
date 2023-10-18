"use client";

import { useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import useGeolocation from "@/hooks/useGeolocation";
import { Coordinates } from "@/utils/types";
import { INITIAL_CENTER } from "@/hooks/useMap";
import SearchSection from "./components/SearchSection";
import MapSection from "./components/MapSection";
import Markers from "./components/Markers";
import PlaceReviewList from "./components/PlaceReviewList";
import Empty from "@/app/components/Empty";
import LoadingMap from "./components/LoadingMap";
import ResetButton from "./components/ResetButton";

const List = () => {
  const naverLocation = useGeolocation();
  const {
    initializeMap,
    fetchPlaceReview,
    fetchPlaceReviewByName,
    searchKeyword,
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
  }, [searchKeyword]);

  return (
    <div className="contents-container">
      {!loaded ? (
        <LoadingMap />
      ) : (
        <>
          <div className="relative pt-8">
            <SearchSection onClick={handleSubmit} />
            <MapSection currentCenter={currentCenter} />
            {locals && <Markers items={locals} />}
          </div>
          <div className="relative h-2">
            <div className="absolute right-0 py-2">
              <ResetButton />
            </div>
          </div>
          {!data ? (
            <Empty title={""} message={"작성된 리뷰가 없어요 ㅜ.ㅜ"} />
          ) : (
            <PlaceReviewList data={data} />
          )}
        </>
      )}
    </div>
  );
};

export default List;
