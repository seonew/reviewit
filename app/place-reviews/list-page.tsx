"use client";

import { useEffect, useState } from "react";
import { useBoundStore as useStore } from "@/store";
import { PlaceReviewDataProps } from "@/types";
import SearchSection from "./components/SearchSection";
import PlaceReviewList from "./components/PlaceReviewList";
import Pagination from "../components/Pagination";

type Props = {
  reviews: PlaceReviewDataProps | null;
};

const List = ({ reviews }: Props) => {
  const { initializeMap, fetchPlaceReviews, setPlaceReviews, placeReviews } =
    useStore();
  const { count } = placeReviews;
  const [page, setPage] = useState<number>(1);

  const handleClickPage = (current: number) => {
    setPage(current);
    fetchPlaceReviews(current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    fetchPlaceReviews(page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    fetchPlaceReviews(page + 1);
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    if (reviews) {
      setPlaceReviews(reviews);
    }
  }, [reviews, setPlaceReviews]);

  return (
    <div className="contents-container">
      <div className="relative pt-8">
        <SearchSection />
      </div>
      {count > 0 ? (
        <>
          <PlaceReviewList placeReviewData={placeReviews} />
          <Pagination
            total={count}
            limit={5}
            currentPage={page}
            onClickPage={handleClickPage}
            onClickPrev={handleClickPrevButton}
            onClickNext={handleClickNextButton}
          />
        </>
      ) : (
        <div>로그인이 필요한 걸?</div>
      )}
    </div>
  );
};

export default List;
