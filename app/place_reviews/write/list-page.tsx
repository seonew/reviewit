"use client";

import { useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import useGeolocation from "@/hooks/useGeolocation";
import LocalList from "../components/LocalList";
import SearchSection from "../components/SearchSection";
import Loading from "../components/Loading";
import CommentModal from "../components/CommentModal";
import { handleClickSignIn } from "@/utils/common";
import CategoryButtonGroup from "../components/CategoryButtonGroup";
import ResetButton from "../components/ResetButton";

const List = () => {
  const location = useGeolocation();
  const {
    initializeMap,
    fetchLocalPlaces,
    fetchLocalPlacesByCode,
    insertPlaceReview,
    setLocalPlaces,
    setSelectedCategory,
    localPlaces,
    searchKeyword,
    selectedCategory,
    user,
  } = useStore();

  const loaded = location.loaded;

  const handleSubmit = (keyword: string) => {
    fetchLocalPlaces(`${keyword}`);
  };

  const handleSubmitCode = (code: string) => {
    setSelectedCategory(code);
    fetchLocalPlacesByCode(`${code}`);
  };

  const handleSubmitReview = (review: string, like: boolean) => {
    if (!user.id && !user.name) {
      handleClickSignIn();
      return;
    }
    insertPlaceReview(review, like);
  };

  const handleClickReset = () => {
    setSelectedCategory("");
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    setLocalPlaces(null);
  }, [searchKeyword, selectedCategory]);

  return (
    <div className="contents-container">
      {!loaded ? (
        <Loading />
      ) : (
        <>
          <div className="relative pt-8">
            <SearchSection onClick={handleSubmit} />
            <CategoryButtonGroup
              onClick={handleSubmitCode}
              selectedCode={selectedCategory}
            >
              <ResetButton onClick={handleClickReset} />
            </CategoryButtonGroup>
          </div>
          {localPlaces && (
            <div>
              <p className="pt-10 pb-1 text-xs">
                <span className="font-semibold">{localPlaces?.length}건</span>의
                검색 결과가 있습니다.
              </p>
              <LocalList items={localPlaces} />
            </div>
          )}
          <CommentModal onSubmit={handleSubmitReview} />
        </>
      )}
    </div>
  );
};

export default List;
