"use client";

import { useEffect, useState } from "react";
import { useBoundStore as useStore } from "@/store";
import useGeolocation from "@/hooks/useGeolocation";
import { Coordinates } from "@/utils/types";
import { INITIAL_CENTER } from "@/hooks/useMap";
import SearchSection from "./components/SearchSection";
import MapSection from "./components/MapSection";
import Markers from "./components/Markers";
import PlaceReviewList from "./components/PlaceReviewList";
import PlaceReviewsWithKeyword from "./components/PlaceReviewsWithKeyword";
import Pagination from "../components/Pagination";
import Empty from "@/app/components/Empty";
import LoadingMap from "./components/LoadingMap";
import ResetButton from "./components/ResetButton";

const List = () => {
  const naverLocation = useGeolocation();
  const {
    initializeMap,
    fetchPlaceReview,
    fetchPlaceReviewsWithKeyword,
    searchKeyword,
    placeReviews,
    keywordReviews,
  } = useStore();

  const loaded = naverLocation.loaded;
  const coordinates = naverLocation.coordinates;

  const currentCenter: Coordinates =
    loaded && coordinates
      ? [coordinates?.lat, coordinates?.lng]
      : INITIAL_CENTER;

  const getData = () => {
    const { data, locals: localsResult, count } = placeReviews;
    let locals = localsResult;

    if (searchKeyword !== "") {
      const { data, locals: localsWithKeyword } = keywordReviews;
      locals = localsWithKeyword;
    }
    return { data, locals, count };
  };

  const { data, locals, count } = getData();
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    fetchPlaceReview(current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    fetchPlaceReview(page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    fetchPlaceReview(page + 1);
  };

  const handleSubmit = (keyword: string) => {
    if (keyword === "") {
      return;
    }
    fetchPlaceReviewsWithKeyword(keyword);
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    if (searchKeyword === "") {
      fetchPlaceReview(1);
    }
  }, [searchKeyword, fetchPlaceReview]);

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
            <>
              {searchKeyword ? (
                <PlaceReviewsWithKeyword data={keywordReviews} />
              ) : (
                <>
                  <PlaceReviewList data={placeReviews} />
                  <Pagination
                    total={count}
                    limit={5}
                    currentPage={page}
                    onClickPage={handleClickPage}
                    onClickPrev={handleClickPrevButton}
                    onClickNext={handleClickNextButton}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default List;
